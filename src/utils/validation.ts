export interface ValidationRule {
  field: string
  label: string
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean
  message?: string
}

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export class Validator {
  private rules: ValidationRule[]

  constructor(rules: ValidationRule[]) {
    this.rules = rules
  }

  validate(data: any): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationError[] = []

    this.rules.forEach(rule => {
      const value = this.getNestedValue(data, rule.field)
      const fieldErrors = this.validateField(value, rule)

      if (fieldErrors.length > 0) {
        errors.push(...fieldErrors)
      }
    })

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  validateField(value: any, rule: ValidationRule): ValidationError[] {
    const errors: ValidationError[] = []

    // Required check
    if (rule.required && this.isEmpty(value)) {
      errors.push({
        field: rule.field,
        message: rule.message || `${rule.label} is required`
      })
      return errors // Skip other validations if required and empty
    }

    // Skip other validations if empty and not required
    if (this.isEmpty(value)) {
      return errors
    }

    // String validations
    if (typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.label} must be at least ${rule.minLength} characters`
        })
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.label} must be no more than ${rule.maxLength} characters`
        })
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.label} format is invalid`
        })
      }
    }

    // Number validations
    if (typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.label} must be at least ${rule.min}`
        })
      }

      if (rule.max !== undefined && value > rule.max) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.label} must be no more than ${rule.max}`
        })
      }
    }

    // Array validation
    if (Array.isArray(value)) {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.label} must have at least ${rule.minLength} item(s)`
        })
      }
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors.push({
        field: rule.field,
        message: rule.message || `${rule.label} validation failed`
      })
    }

    return errors
  }

  private isEmpty(value: any): boolean {
    if (value === null || value === undefined) return true
    if (typeof value === 'string' && value.trim() === '') return true
    if (Array.isArray(value) && value.length === 0) return true
    if (typeof value === 'object' && Object.keys(value).length === 0) return true
    return false
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }
}

// Step-specific validation schemas
export const scopeValidationRules: ValidationRule[] = [
  { field: 'organizationName', label: 'Organization Name', required: true, minLength: 2 },
  { field: 'internalIssues', label: 'Internal Issues', required: true, minLength: 1 },
  { field: 'externalIssues', label: 'External Issues', required: true, minLength: 1 },
  { field: 'interestedParties', label: 'Interested Parties', required: true, minLength: 1 },
  { field: 'scopeDocument.processesAndServices', label: 'Processes and Services', required: true, minLength: 1 },
  { field: 'scopeDocument.departments', label: 'Departments', required: true, minLength: 1 },
  { field: 'scopeDocument.physicalLocations', label: 'Physical Locations', required: true, minLength: 1 }
]

export const riskAssessmentValidationRules: ValidationRule[] = [
  { field: 'risks', label: 'Identified Risks', required: true, minLength: 1 },
  {
    field: 'risks',
    label: 'Risk Details',
    custom: (risks: any[]) => {
      if (!Array.isArray(risks)) return false
      return risks.every(risk =>
        risk.title &&
        risk.description &&
        risk.likelihood > 0 &&
        risk.impact > 0
      )
    },
    message: 'All risks must have title, description, likelihood, and impact'
  }
]

export const soaValidationRules: ValidationRule[] = [
  { field: 'controls', label: 'SOA Controls', required: true, minLength: 1 },
  {
    field: 'controls',
    label: 'Control Justifications',
    custom: (controls: any[]) => {
      if (!Array.isArray(controls)) return false
      return controls.every(control =>
        control.justification || control.applicable === false
      )
    },
    message: 'All applicable controls must have justifications'
  }
]

export const objectivesValidationRules: ValidationRule[] = [
  { field: 'objectives', label: 'Security Objectives', required: true, minLength: 1 },
  {
    field: 'objectives',
    label: 'Objective Details',
    custom: (objectives: any[]) => {
      if (!Array.isArray(objectives)) return false
      return objectives.filter(o => o.selected).every(obj =>
        obj.targetValue &&
        obj.measurementMethod &&
        obj.frequency &&
        obj.responsibleRole
      )
    },
    message: 'Selected objectives must have complete measurement details'
  }
]

export const calculateCompletionPercentage = (validationResult: ValidationResult, totalFields: number): number => {
  if (totalFields === 0) return 0

  const completedFields = totalFields - validationResult.errors.length
  return Math.round((completedFields / totalFields) * 100)
}

export const getStepStatus = (completionPercentage: number): 'not-started' | 'in-progress' | 'completed' => {
  if (completionPercentage === 0) return 'not-started'
  if (completionPercentage < 100) return 'in-progress'
  return 'completed'
}
