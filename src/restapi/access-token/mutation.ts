import axios from 'axios'
import { SOCIAL_CONNECTOR_LOGIN_URI } from './constants'

export const getSocialConnectorAccountToken = async (data: any) => {
  const socialConnectorAccount = await axios
    .post(`${SOCIAL_CONNECTOR_LOGIN_URI}`, data)
    .then(({ data }) => data)
    .catch((err) => {
      throw new Error(err)
    })
  return socialConnectorAccount
}
