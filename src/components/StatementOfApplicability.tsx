import React, { useState, useEffect } from 'react'
import { CheckCircle, X, Search, FileText, Download, Shield, AlertTriangle, Info, Filter } from 'lucide-react'
import iso27001AnnexAControls from '../../soa-controls'

interface ISO27001Control {
  id: string
  title: string
  description: string
  category: string
  domain: string
  objective: string
  implementationGuidance: string
  typicalEvidence: string[]
  relatedControls: string[]
  mandatory: boolean
}

interface ScopeData {
  organizationName: string
  internalIssues: string[]
  externalIssues: string[]
  interestedParties: Array<{
    party: string
    requirements: string
    influence: string
  }>
  interfaces: Array<{
    system: string
    dependency: string
    impact: string
  }>
  exclusions: Array<{
    item: string
    justification: string
  }>
  scopeDocument: {
    processesAndServices: string[]
    departments: string[]
    physicalLocations: string[]
    additionalNotes: string
  }
}


interface ControlApplicability {
  controlId: string
  status: 'applicable' | 'not-applicable' | 'partially-applicable'
  implementationStatus: 'not-implemented' | 'planned' | 'in-progress' | 'implemented'
  justification: string
  implementationDescription: string
  responsibleParty: string
  targetDate: string
  evidence: string[]
  notes: string
}

interface Treatment {
  riskId: string
  selectedControls: string[]
  strategy: string
}

interface StatementOfApplicabilityProps {
  scopeData: ScopeData | null
}


const StatementOfApplicability: React.FC<StatementOfApplicabilityProps> = ({ scopeData }) => {
  const [controlApplicabilities, setControlApplicabilities] = useState<ControlApplicability[]>([])
  const [selectedControl, setSelectedControl] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [showOnlyTreatmentControls, setShowOnlyTreatmentControls] = useState(false)
  const [treatmentControls, setTreatmentControls] = useState<string[]>([])

  useEffect(() => {
    // Load controls from risk treatments first
    const savedTreatments = localStorage.getItem('riskTreatments')
    let treatmentControlIds: string[] = []
    if (savedTreatments) {
      try {
        const treatments: Treatment[] = JSON.parse(savedTreatments)
        const allSelectedControls = treatments.flatMap(treatment => treatment.selectedControls)
        treatmentControlIds = [...new Set(allSelectedControls)]
        setTreatmentControls(treatmentControlIds)
      } catch (error) {
        console.error('Error loading treatment controls:', error)
      }
    }

    // Load existing SOA data
    const savedSOA = localStorage.getItem('statementOfApplicability')
    if (savedSOA) {
      try {
        const soaData = JSON.parse(savedSOA)
        // Update status for controls selected in risk treatments
        const updatedSOA = soaData.map((ca: ControlApplicability) => {
          if (treatmentControlIds.includes(ca.controlId)) {
            return {
              ...ca,
              status: ca.status === 'not-applicable' ? 'applicable' : ca.status,
              justification: ca.justification || 'Selected in risk treatment plan for identified risks',
              implementationStatus: ca.implementationStatus === 'not-implemented' ? 'planned' : ca.implementationStatus
            }
          }
          return ca
        })
        setControlApplicabilities(updatedSOA)
        // Save updated data back to localStorage
        if (JSON.stringify(updatedSOA) !== JSON.stringify(soaData)) {
          localStorage.setItem('statementOfApplicability', JSON.stringify(updatedSOA))
        }
      } catch (error) {
        console.error('Error loading SOA data:', error)
      }
    } else {
      // Initialize with default values
      const initialSOA = iso27001AnnexAControls.map(control => {
        const isFromTreatment = treatmentControlIds.includes(control.id)
        return {
          controlId: control.id,
          status: (control.mandatory || isFromTreatment) ? 'applicable' : 'not-applicable' as 'applicable' | 'not-applicable' | 'partially-applicable',
          implementationStatus: isFromTreatment ? 'planned' : 'not-implemented' as 'not-implemented' | 'planned' | 'in-progress' | 'implemented',
          justification: control.mandatory
            ? 'Mandatory control required for ISO 27001 compliance'
            : isFromTreatment
            ? 'Selected in risk treatment plan for identified risks'
            : '',
          implementationDescription: '',
          responsibleParty: '',
          targetDate: '',
          evidence: [],
          notes: ''
        }
      })
      setControlApplicabilities(initialSOA)
      localStorage.setItem('statementOfApplicability', JSON.stringify(initialSOA))
    }
  }, [])

  const updateControlApplicability = (controlId: string, updates: Partial<ControlApplicability>) => {
    const updatedApplicabilities = controlApplicabilities.map(ca =>
      ca.controlId === controlId ? { ...ca, ...updates } : ca
    )
    setControlApplicabilities(updatedApplicabilities)
    localStorage.setItem('statementOfApplicability', JSON.stringify(updatedApplicabilities))

    // Dispatch custom event to notify other components (like Dashboard)
    window.dispatchEvent(new Event('isms-data-updated'))
  }

  const getFilteredControls = () => {
    let filtered = iso27001AnnexAControls

    if (searchTerm) {
      filtered = filtered.filter(control =>
        control.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(control => control.category === filterCategory)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(control => {
        const applicability = controlApplicabilities.find(ca => ca.controlId === control.id)
        return applicability?.status === filterStatus
      })
    }

    if (showOnlyTreatmentControls) {
      filtered = filtered.filter(control => treatmentControls.includes(control.id))
    }

    return filtered
  }

  const getCategories = () => {
    const categories = [...new Set(iso27001AnnexAControls.map(control => control.category))]
    return categories.sort()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applicable': return 'text-green-800 bg-green-50 border-green-200'
      case 'not-applicable': return 'text-red-800 bg-red-50 border-red-200'
      case 'partially-applicable': return 'text-yellow-800 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-800 bg-gray-50 border-gray-200'
    }
  }

  const getImplementationStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'text-green-800 bg-green-50 border-green-200'
      case 'in-progress': return 'text-blue-800 bg-blue-50 border-blue-200'
      case 'planned': return 'text-yellow-800 bg-yellow-50 border-yellow-200'
      case 'not-implemented': return 'text-red-800 bg-red-50 border-red-200'
      default: return 'text-gray-800 bg-gray-50 border-gray-200'
    }
  }

  const exportSOA = () => {
    const applicableControls = controlApplicabilities.filter(ca => ca.status === 'applicable' || ca.status === 'partially-applicable')
    const notApplicableControls = controlApplicabilities.filter(ca => ca.status === 'not-applicable')

    const data = {
      organization: scopeData?.organizationName || 'Organization',
      generatedDate: new Date().toLocaleDateString(),
      applicableCount: applicableControls.length,
      notApplicableCount: notApplicableControls.length,
      totalCount: iso27001AnnexAControls.length,
      applicableControls: applicableControls.map(ca => {
        const control = iso27001AnnexAControls.find(c => c.id === ca.controlId)
        return {
          control,
          applicability: ca
        }
      }),
      notApplicableControls: notApplicableControls.map(ca => {
        const control = iso27001AnnexAControls.find(c => c.id === ca.controlId)
        return {
          control,
          applicability: ca
        }
      })
    }

    const markdown = `# Statement of Applicability (SOA)
## ${data.organization}
**Generated:** ${data.generatedDate}

## Summary
- **Total Controls:** ${data.totalCount}
- **Applicable:** ${data.applicableCount}
- **Not Applicable:** ${data.notApplicableCount}
- **Coverage:** ${Math.round((data.applicableCount / data.totalCount) * 100)}%

## Applicable Controls

${data.applicableControls.map(item => `
### ${item.control?.id}: ${item.control?.title}

**Category:** ${item.control?.category}
**Status:** ${item.applicability.status.toUpperCase()}
**Implementation Status:** ${item.applicability.implementationStatus.replace('-', ' ').toUpperCase()}

**Description:**
${item.control?.description}

**Justification:**
${item.applicability.justification || 'No justification provided'}

**Implementation Description:**
${item.applicability.implementationDescription || 'No implementation description provided'}

**Responsible Party:** ${item.applicability.responsibleParty || 'Not assigned'}
**Target Date:** ${item.applicability.targetDate || 'Not set'}

${item.applicability.evidence.length > 0 ? `**Evidence:**\n${item.applicability.evidence.map(e => `- ${e}`).join('\n')}` : ''}

${item.applicability.notes ? `**Notes:**\n${item.applicability.notes}` : ''}

---
`).join('')}

## Not Applicable Controls

${data.notApplicableControls.map(item => `
### ${item.control?.id}: ${item.control?.title}

**Category:** ${item.control?.category}
**Status:** NOT APPLICABLE

**Justification:**
${item.applicability.justification || 'No justification provided'}

---
`).join('')}

## Control Categories Coverage

${getCategories().map(category => {
  const categoryControls = iso27001AnnexAControls.filter(c => c.category === category)
  const applicableCategoryControls = categoryControls.filter(c => {
    const ca = controlApplicabilities.find(ca => ca.controlId === c.id)
    return ca?.status === 'applicable' || ca?.status === 'partially-applicable'
  })
  const coverage = Math.round((applicableCategoryControls.length / categoryControls.length) * 100)

  return `### ${category}
- **Total Controls:** ${categoryControls.length}
- **Applicable:** ${applicableCategoryControls.length}
- **Coverage:** ${coverage}%`
}).join('\n\n')}
`

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(scopeData?.organizationName || 'organization').toLowerCase().replace(/\s+/g, '-')}-statement-of-applicability.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredControls = getFilteredControls()
  const applicableCount = controlApplicabilities.filter(ca => ca.status === 'applicable').length
  const partiallyApplicableCount = controlApplicabilities.filter(ca => ca.status === 'partially-applicable').length
  const notApplicableCount = controlApplicabilities.filter(ca => ca.status === 'not-applicable').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl p-6" style={{backgroundColor: '#581c87', color: 'white'}}>
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Statement of Applicability</h2>
        </div>
        <p className="text-purple-100 mb-4">
          Based on your risk assessment and treatment decisions, document which Annex A controls are applicable, partially applicable, or not applicable with proper justifications.
        </p>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{iso27001AnnexAControls.length}</div>
            <div className="text-sm" style={{color: '#f3e8ff'}}>Total Controls</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{applicableCount}</div>
            <div className="text-sm" style={{color: '#f3e8ff'}}>Applicable</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{partiallyApplicableCount}</div>
            <div className="text-sm" style={{color: '#f3e8ff'}}>Partially</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{notApplicableCount}</div>
            <div className="text-sm" style={{color: '#f3e8ff'}}>Not Applicable</div>
          </div>
        </div>
      </div>

      {/* Risk Treatment Integration Summary */}
      {treatmentControls.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Risk Treatment Integration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{treatmentControls.length}</div>
              <div className="text-sm text-blue-700">Controls from Risk Treatments</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((treatmentControls.length / iso27001AnnexAControls.length) * 100)}%
              </div>
              <div className="text-sm text-blue-700">Coverage by Risk Treatments</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">
                {controlApplicabilities.filter(ca =>
                  treatmentControls.includes(ca.controlId) && ca.status === 'applicable'
                ).length}
              </div>
              <div className="text-sm text-blue-700">Treatment Controls Applied</div>
            </div>
          </div>
          <p className="text-blue-700 text-sm mt-4">
            Controls highlighted in blue below have been automatically selected based on your risk treatment plans.
            Their status has been set to "applicable" and implementation status to "planned".
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Controls</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, title, or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Categories</option>
              {getCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="applicable">Applicable</option>
              <option value="partially-applicable">Partially Applicable</option>
              <option value="not-applicable">Not Applicable</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter Options</label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showOnlyTreatmentControls}
                onChange={(e) => setShowOnlyTreatmentControls(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Risk Treatment Controls Only</span>
            </label>
          </div>
        </div>

        {treatmentControls.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Info className="w-4 h-4" />
              <span className="text-sm font-medium">
                {treatmentControls.length} controls selected in Risk Treatment
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Controls List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredControls.map(control => {
          const applicability = controlApplicabilities.find(ca => ca.controlId === control.id)
          const isFromTreatment = treatmentControls.includes(control.id)

          return (
            <div
              key={control.id}
              className={`bg-white rounded-xl border p-6 transition-all hover:shadow-md ${
                isFromTreatment ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              } ${selectedControl === control.id ? 'ring-2 ring-purple-500' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {control.id}: {control.title}
                    </h3>
                    {control.mandatory && (
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                        Mandatory
                      </span>
                    )}
                    {isFromTreatment && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        Risk Treatment
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{control.category}</p>
                  <p className="text-gray-700">{control.description}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(applicability?.status || 'not-applicable')}`}>
                    {applicability?.status?.replace('-', ' ') || 'not applicable'}
                  </span>
                  <button
                    onClick={() => setSelectedControl(selectedControl === control.id ? null : control.id)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    {selectedControl === control.id ? <X className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {selectedControl === control.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Applicability Status</label>
                        <select
                          value={applicability?.status || 'not-applicable'}
                          onChange={(e) => updateControlApplicability(control.id, {
                            status: e.target.value as 'applicable' | 'not-applicable' | 'partially-applicable'
                          })}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          <option value="applicable">Applicable</option>
                          <option value="partially-applicable">Partially Applicable</option>
                          <option value="not-applicable">Not Applicable</option>
                        </select>
                      </div>

                      {(applicability?.status === 'applicable' || applicability?.status === 'partially-applicable') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Implementation Status</label>
                          <select
                            value={applicability?.implementationStatus || 'not-implemented'}
                            onChange={(e) => updateControlApplicability(control.id, {
                              implementationStatus: e.target.value as 'not-implemented' | 'planned' | 'in-progress' | 'implemented'
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="not-implemented">Not Implemented</option>
                            <option value="planned">Planned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="implemented">Implemented</option>
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Responsible Party</label>
                        <input
                          type="text"
                          value={applicability?.responsibleParty || ''}
                          onChange={(e) => updateControlApplicability(control.id, { responsibleParty: e.target.value })}
                          placeholder="Who is responsible for this control?"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>

                      {(applicability?.status === 'applicable' || applicability?.status === 'partially-applicable') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Target Implementation Date</label>
                          <input
                            type="date"
                            value={applicability?.targetDate || ''}
                            onChange={(e) => updateControlApplicability(control.id, { targetDate: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4 text-left">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Justification *</label>
                        <div className="mb-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                updateControlApplicability(control.id, { justification: e.target.value })
                              }
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="">Select justification template...</option>
                            {applicability?.status === 'applicable' && (
                              <>
                                <option value="Mandatory control required for ISO 27001 compliance">Mandatory control required for ISO 27001 compliance</option>
                                <option value="Selected in risk treatment plan for identified risks">Selected in risk treatment plan for identified risks</option>
                                <option value="Required to protect confidential information and meet data protection requirements">Required to protect confidential information and meet data protection requirements</option>
                                <option value="Essential for maintaining business continuity and preventing operational disruptions">Essential for maintaining business continuity and preventing operational disruptions</option>
                                <option value="Required by regulatory compliance obligations and industry standards">Required by regulatory compliance obligations and industry standards</option>
                                <option value="Necessary to prevent security incidents and protect against cyber threats">Necessary to prevent security incidents and protect against cyber threats</option>
                                <option value="Critical for maintaining customer trust and protecting sensitive data">Critical for maintaining customer trust and protecting sensitive data</option>
                              </>
                            )}
                            {applicability?.status === 'partially-applicable' && (
                              <>
                                <option value="Partially applicable - some aspects are relevant while others are not applicable due to current environment">Partially applicable - some aspects are relevant while others are not applicable due to current environment</option>
                                <option value="Control is partially implemented - additional measures are needed for full compliance">Control is partially implemented - additional measures are needed for full compliance</option>
                                <option value="Applicable to some systems/processes but not others based on risk assessment">Applicable to some systems/processes but not others based on risk assessment</option>
                              </>
                            )}
                            {applicability?.status === 'not-applicable' && (
                              <>
                                <option value="Not applicable - organization does not have the infrastructure/systems this control addresses">Not applicable - organization does not have the infrastructure/systems this control addresses</option>
                                <option value="Not applicable - control objective is achieved through alternative means">Not applicable - control objective is achieved through alternative means</option>
                                <option value="Not applicable - outside scope of ISMS as defined in scope statement">Not applicable - outside scope of ISMS as defined in scope statement</option>
                                <option value="Not applicable - services are outsourced and covered by supplier agreements">Not applicable - services are outsourced and covered by supplier agreements</option>
                                <option value="Not applicable - organization size and complexity do not warrant this control">Not applicable - organization size and complexity do not warrant this control</option>
                                <option value="Not applicable - technical infrastructure makes this control irrelevant">Not applicable - technical infrastructure makes this control irrelevant</option>
                              </>
                            )}
                          </select>
                        </div>
                        <textarea
                          value={applicability?.justification || ''}
                          onChange={(e) => updateControlApplicability(control.id, { justification: e.target.value })}
                          placeholder={applicability?.status === 'not-applicable'
                            ? "Explain why this control is not applicable..."
                            : "Explain why this control is applicable and how it addresses risks..."
                          }
                          rows={3}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-left"
                        />
                        <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">
                            <strong>Justification Guidelines:</strong>{' '}
                            {applicability?.status === 'applicable' &&
                              "Explain why this control is necessary, what risks it addresses, and how it supports business requirements."
                            }
                            {applicability?.status === 'partially-applicable' &&
                              "Specify which aspects apply and which don't, explaining the reasoning for partial implementation."
                            }
                            {applicability?.status === 'not-applicable' &&
                              "Clearly explain why this control doesn't apply to your organization, referencing scope boundaries, technical environment, or alternative controls."
                            }
                          </p>
                        </div>
                      </div>

                      {(applicability?.status === 'applicable' || applicability?.status === 'partially-applicable') && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Implementation Description</label>
                          <textarea
                            value={applicability?.implementationDescription || ''}
                            onChange={(e) => updateControlApplicability(control.id, { implementationDescription: e.target.value })}
                            placeholder="Describe how this control is or will be implemented..."
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-left"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                        <textarea
                          value={applicability?.notes || ''}
                          onChange={(e) => updateControlApplicability(control.id, { notes: e.target.value })}
                          placeholder="Any additional notes or comments..."
                          rows={2}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-left"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Control Details */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Control Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Objective:</span>
                        <p className="text-gray-600 mt-1">{control.objective}</p>
                      </div>
                      <div>
                        <span className="font-medium">Implementation Guidance:</span>
                        <p className="text-gray-600 mt-1">{control.implementationGuidance}</p>
                      </div>
                      <div>
                        <span className="font-medium">Typical Evidence:</span>
                        <ul className="text-gray-600 mt-1 list-disc list-inside">
                          {control.typicalEvidence.map((evidence, index) => (
                            <li key={index}>{evidence}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="font-medium">Related Controls:</span>
                        <p className="text-gray-600 mt-1">{control.relatedControls.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Export Button */}
      <div className="text-center">
        <button
          onClick={exportSOA}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
        >
          <Download className="w-5 h-5" />
          Export Statement of Applicability
        </button>
      </div>
    </div>
  )
}

export default StatementOfApplicability