'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { MdAdd } from 'react-icons/md'
import useSWR from 'swr'

import { Alert } from '@/components/alerts/alert'
import { confirm } from '@/components/alerts/confirmation'
import { TeamTable } from '@/components/common/datatable/team'
import { ManageTeamMember } from '@/components/common/modals/manage-team-member'
import { Button } from '@/components/ui'
import { Loading } from '@/components/ui/button'
import { useMe } from '@/hooks/use-me'
import { GET_TEAM_MEMBERS } from '@/restapi/teams/constants'
import { deleteTeamMember } from '@/restapi/teams/mutation'
import { Team } from '@/restapi/teams/team'
import { User } from '@/restapi/users/user'

export default function TeamPage() {
  const [showModal, setShowModal] = useState<{
    show: boolean
    data?: User.Entity
    type?: 'add' | 'edit'
  }>({
    show: false
  })

  const { data, isLoading, mutate } = useSWR<RestApi.Response<Team.Entity>>(GET_TEAM_MEMBERS)
  const { me, isLoading: meLoading } = useMe()
  const { push } = useRouter()

  const handleDeleteTeam = async (data: User.Entity) => {
    try {
      const confirmation = await confirm('Are you sure you want to delete this team member?', 'Delete', 'Cancel', {
        title: 'Delete Team Member'
      })
      if (!confirmation) return
      toast.loading('Deleting team member...', {
        id: 'delete-team-member'
      })
      await deleteTeamMember(data._id).then(() => {
        toast.success('Team member deleted successfully.', {
          id: 'delete-team-member'
        })
        mutate()
      })
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong, please try again later.', {
        id: 'delete-team-member'
      })
    }
  }

  useEffect(() => {
    // if user role is member
    if (me?.role === 'member') {
      push('/')
    }
  }, [me, push])
  return (
    <main className="flex flex-col space-y-3 my-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Team Member</h1>
        <Button
          variant="outline"
          onClick={() =>
            setShowModal({
              show: true,
              type: 'add'
            })
          }>
          <MdAdd />
          <span>Add Team Member</span>
        </Button>
      </div>
      {isLoading || meLoading ? (
        <div className="flex items-center justify-center w-full min-h-8rem">
          <Loading />
        </div>
      ) : (
        <>
          {data?.data?.members?.length}
          {data?.data?.members && data?.data?.members?.length > 0 ? (
            <TeamTable
              owner={me}
              data={data?.data?.members}
              onEditRowClick={(v) =>
                setShowModal({
                  show: true,
                  type: 'edit',
                  data: v
                })
              }
              onDeleteRowClick={handleDeleteTeam}
            />
          ) : (
            <Alert
              variant="warning"
              title="No team members found"
              description="Try to add a new team member by clicking Add Team Member button above."
            />
          )}
        </>
      )}
      <ManageTeamMember
        type={showModal.type}
        show={showModal.show}
        data={showModal?.data}
        onClose={() =>
          setShowModal({
            show: false
          })
        }
        onSuccess={() => mutate()}
      />
    </main>
  )
}
