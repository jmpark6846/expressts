import { validate, ValidationError } from 'class-validator'
import { plainToClass } from 'class-transformer'
import ValidationException from '../exceptions/ValidationException'

async function validateData(type: any, data: any, skipMissingProperties: boolean = false) {
  const classData = plainToClass(type, data)
  const errors: ValidationError[] = await validate(classData, {
    skipMissingProperties,
  })
  if (errors.length > 0) {
    const messages = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ')
    throw new ValidationException(messages)
  }
}

export default validateData
