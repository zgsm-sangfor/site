export interface EnterpriseLeadInput {
  company: string
  name: string
  contact: string
  scale: string
  message: string
  consent: boolean
}

export type EnterpriseLeadError =
  | 'submitFailed'
  | 'serviceUnavailable'
  | 'tooManyRequests'
  | 'verificationRequired'
