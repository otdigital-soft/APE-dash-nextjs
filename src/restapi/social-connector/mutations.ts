import axios from 'axios'
import { SOLANA_PROVIDER_URI } from './constant'

export const getSocialConnectorAccount = async (huslData: any, solData: any) => {
  const husl = await axios
    .post(`${SOLANA_PROVIDER_URI}`, huslData)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
  const sol = await axios
    .post(`${SOLANA_PROVIDER_URI}`, solData)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })

  return [husl, sol]
}
