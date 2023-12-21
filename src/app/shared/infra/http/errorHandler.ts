import { type Request, type Response, type NextFunction } from 'express'
import { DomainError, InfraError } from '../../../errors'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function errorHandler (err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof InfraError) {
    res.status(500).json({ error: 'Internal server error' })
    return
  }
  if (err instanceof DomainError) {
    res.status(400).json({ error: err.message })
    return
  }
  next(err)
}
