'use client'
import QueryString from 'qs'
import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import { MdAdd, MdDelete, MdEdit, MdLogin } from 'react-icons/md'
import useSWR from 'swr'

import { confirm } from '@/components/alerts/confirmation'
import Button, { Loading } from '@/components/ui/button'
import { PasswordMask } from '@/components/ui/forms'
import { socials } from '@/constants/app'
import { useMe } from '@/hooks/use-me'
import { addHttp } from '@/lib/utils'
import { GET_ALL_ACCOUNT } from '@/restapi/accounts/constants'
import { createAccount, deleteAccount } from '@/restapi/accounts/mutation'
import { generateCRMAccount } from '@/restapi/crm/mutations'

import { DataTable } from '../'
import { AddAccessManagerModal } from '../../modals/access-manager/add'
import { EditAccessManagerModal } from '../../modals/access-manager/edit'
import { AccessManagerCompactTable } from './compact'

interface AccessManagerTableProps {
  social?: boolean
  showActions?: boolean
}
export const AccessManagerTable: React.FC<AccessManagerTableProps> = ({ social, showActions }) => {
  const { me } = useMe()
  const { data: accounts, mutate, isLoading } = useSWR<RestApi.Response<Account.Account[]>>(GET_ALL_ACCOUNT)
  const [showAddModal, setShowAddModal] = useState(false)
  const [edit, setEdit] = useState<{
    state: boolean
    data?: Account.Dto & {
      _id: string
    }
  }>({
    state: false,
    data: undefined
  })

  const handleDelete = async (id: string) => {
    const confirmation = await confirm('Are you sure you want to delete this account?')
    if (confirmation) {
      try {
        const account = await deleteAccount(id)
        if (account) {
          toast.success('Account deleted successfully')
          mutate?.()
        } else {
          toast.error('Failed to delete account')
        }
      } catch (_) {
        toast.error('Failed to delete account')
      }
    }
  }

  const handleGenerateCRMAccount = async () => {
    // if there is no email, then we can't generate CRM account
    if (!me?.email || me?.email == '') {
      await confirm(
        'You need to add email address in order to generate CRM Account. Please contact support to add your email address.',
        'Close',
        '',
        {
          title: 'No Email Address'
        }
      )
      return
    }

    const confirmation = await confirm('Generate new CRM account?')
    if (!confirmation) return
    try {
      const body = {
        firstname: me?.name?.split(' ')[0] || '',
        lastname: me?.name?.split(' ').pop() || '',
        email: me?.email,
        company: me?.name,
        password: Math.random().toString(36).slice(-8),
        website: me?.websiteUrl || me?.business?.[0]?.domain || ''
      }
      const account = await generateCRMAccount(body)
      if (account) {
        toast.success('CRM account generated successfully')
        // create access manager account
        await createAccount({
          websiteKey: 'crm.husl.xyz',
          username: body?.email || '',
          password: body?.password,
          verified: true,
          social: false
        })
        mutate?.()
        const param = QueryString.stringify({
          identifier: body?.email,
          password: body?.password
        })
        window.open(process.env.CRM_API_URL + '/authentication/direct_login?' + param, '_blank')
      } else {
        toast.error('Failed to generate CRM account')
      }
    } catch (_) {
      toast.error('Failed to generate CRM account')
    }
  }

  const accs = useMemo(() => {
    if (!accounts?.data) return []
    if (!social) return accounts?.data
    return accounts?.data?.filter((v) => socials.find((s) => v.websiteKey.includes(s)))
  }, [accounts, social])

  const hasCRMAccount = useMemo(() => {
    if (!accounts?.data) return false
    return accounts?.data?.find((v) => v.websiteKey === 'crm.husl.xyz')
  }, [accounts])

  const handleQuickCRMLogin = async (row?: Account.Account) => {
    const confirmation = await confirm('Login to CRM?')
    if (!confirmation) return
    const param = QueryString.stringify({
      identifier: row?.username,
      password: row?.password
    })
    window.open(process.env.CRM_API_URL + '/authentication/direct_login?' + param, '_blank')
  }

  const columns = useMemo(() => {
    return [
      {
        Header: 'Website List',
        accessor: 'websiteKey',
        Cell: (c: any) => {
          const row = c?.row?.original
          let url = row?.websiteKey
          if (url.includes('crm.husl.xyz')) {
            url = 'crm.husl.xyz' + '?' + row?.username
          }
          return (
            <a href={addHttp(url)} target="_blank" className="text-primary hover:underline">
              {row?.websiteKey}
            </a>
          )
        }
      },
      {
        Header: 'Identifier',
        accessor: 'username'
      },
      {
        Header: 'Password',
        accessor: 'password',
        width: 150,
        Cell: (c: any) => {
          const row = c?.row?.original
          return <PasswordMask password={row?.password} />
        }
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        width: 100,
        Cell: (c: any) => {
          const row = c?.row?.original
          return (
            <div className="flex space-x-2 items-center">
              {row?.websiteKey === 'crm.husl.xyz' && (
                <button
                  onClick={() => handleQuickCRMLogin(row)}
                  className="w-8 h-8 flex items-center justify-center bg-primary bg-opacity-10 rounded-full shadow text-center text-primary">
                  <MdLogin />
                </button>
              )}
              <button
                onClick={() => {
                  setEdit({
                    state: true,
                    data: row
                  })
                }}
                className="w-8 h-8 flex items-center justify-center bg-primary bg-opacity-10 rounded-full shadow text-center">
                <MdEdit />
              </button>
              <button
                onClick={() => handleDelete(row?._id)}
                className="w-8 h-8 flex items-center justify-center bg-primary bg-opacity-10 rounded-full shadow">
                <MdDelete />
              </button>
            </div>
          )
        }
      }
    ]
  }, [])
  return (
    <>
      {isLoading && (
        <div className="flex justify-center items-center min-h-500px">
          <Loading />
        </div>
      )}
      {!isLoading && (
        <>
          <DataTable
            columns={columns}
            data={accs}
            showSearch
            searchOnHeader
            limitOptions={[5, 10, 15, 20]}
            totalData={0}
            initialState={{
              hiddenColumns: ['role']
            }}
            className="hidden lg:block"
            onAddRow={() => setShowAddModal(true)}
            showAddRow
            addRowText="Add Site"
            showActions={showActions}
            actions={
              !hasCRMAccount ? (
                <Button variant="outline" className="border-primary space-x-2" onClick={handleGenerateCRMAccount}>
                  <MdAdd />
                  <span>CRM Access</span>
                </Button>
              ) : (
                <></>
              )
            }
          />
          <div className="lg:hidden">
            <AccessManagerCompactTable data={accs} />
          </div>
        </>
      )}
      <AddAccessManagerModal show={showAddModal} onClose={() => setShowAddModal(false)} width="24rem" hideClose />
      <EditAccessManagerModal
        show={edit.state}
        data={edit.data}
        onClose={() =>
          setEdit({
            ...edit,
            state: false
          })
        }
        width="24rem"
        hideClose
      />
    </>
  )
}
