import React, { useState, useEffect } from 'react'
import { Download, FileText, AlertTriangle, Search, CheckCircle, RefreshCcw, Plus, Trash2, ChevronRight, ChevronLeft } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } from 'docx'

interface ScopeData {
  organizationName: string
}

interface NonConformity {
  id: string
  source: string
  description: string
  dateIdentified: string
  severity: 'minor' | 'major' | 'critical'
  status: 'identified' | 'analyzing' | 'action-planned' | 'implementing' | 'verifying' | 'closed'
  relatedRequirement: string
  rootCauseMethod: string
  rootCause: string
  contributingFactors: string
  correctiveAction: string
  responsibleParty: string
  targetDate: string
  resourcesRequired: string
  verificationMethod: string
  verificationDate: string
  verificationResult: 'effective' | 'not-effective' | 'pending'
  verifiedBy: string
  customNotes: string
}

interface CorrectiveActionsProps {
  scopeData: ScopeData | null
}

const CorrectiveActions: React.FC<CorrectiveActionsProps> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [nonConformities, setNonConformities] = useState<NonConformity[]>([
    {
      id: 'NC-001',
      source: 'Internal Audit',
      description: 'Access control logs are not reviewed regularly as required by A.8.15',
      dateIdentified: new Date().toISOString().split('T')[0],
      severity: 'major',
      status: 'identified',
      relatedRequirement: 'ISO 27001:2022 Control A.8.15 - Logging',
      rootCauseMethod: '',
      rootCause: '',
      contributingFactors: '',
      correctiveAction: '',
      responsibleParty: '',
      targetDate: '',
      resourcesRequired: '',
      verificationMethod: '',
      verificationDate: '',
      verificationResult: 'pending',
      verifiedBy: '',
      customNotes: ''
    }
  ])
  const [selectedNC, setSelectedNC] = useState<string>('NC-001')
  const [integrationStatus, setIntegrationStatus] = useState({
    scope: false,
    soa: false,
    riskAssessment: false,
    internalAudit: false,
    managementReview: false
  })

  useEffect(() => {
    // Check integration status
    const hasScope = localStorage.getItem('isms-scope-data') !== null
    const hasSoa = localStorage.getItem('isms-soa-data') !== null
    const hasRiskAssessment = localStorage.getItem('isms-risk-assessment-data') !== null
    const hasInternalAudit = localStorage.getItem('isms-internal-audit-data') !== null
    const hasManagementReview = localStorage.getItem('isms-management-review-data') !== null

    setIntegrationStatus({
      scope: hasScope,
      soa: hasSoa,
      riskAssessment: hasRiskAssessment,
      internalAudit: hasInternalAudit,
      managementReview: hasManagementReview
    })

    // Load saved data
    const savedData = localStorage.getItem('isms-corrective-actions')
    if (savedData) {
      const parsed = JSON.parse(savedData)
      setNonConformities(parsed.nonConformities || nonConformities)
    }
  }, [])

  const saveData = (data: NonConformity[]) => {
    localStorage.setItem('isms-corrective-actions', JSON.stringify({
      nonConformities: data,
      lastUpdated: new Date().toISOString()
    }))
  }

  const addNonConformity = () => {
    const newId = `NC-${String(nonConformities.length + 1).padStart(3, '0')}`
    const newNC: NonConformity = {
      id: newId,
      source: 'Internal Audit',
      description: '',
      dateIdentified: new Date().toISOString().split('T')[0],
      severity: 'minor',
      status: 'identified',
      relatedRequirement: '',
      rootCauseMethod: '',
      rootCause: '',
      contributingFactors: '',
      correctiveAction: '',
      responsibleParty: '',
      targetDate: '',
      resourcesRequired: '',
      verificationMethod: '',
      verificationDate: '',
      verificationResult: 'pending',
      verifiedBy: '',
      customNotes: ''
    }
    const updated = [...nonConformities, newNC]
    setNonConformities(updated)
    setSelectedNC(newId)
    saveData(updated)
  }

  const importFromAudit = () => {
    try {
      const auditData = localStorage.getItem('internalAuditProcedure')
      if (!auditData) {
        alert('No audit findings available to import. Complete internal audits first.')
        return
      }

      const { audits } = JSON.parse(auditData)
      if (!audits || audits.length === 0) {
        alert('No audit findings available to import.')
        return
      }

      // Import findings from completed audits as non-conformities
      const importedNCs: NonConformity[] = []
      audits.forEach((audit: any) => {
        if (audit.status === 'completed' && audit.findings) {
          audit.findings.forEach((finding: any) => {
            const newId = `NC-${String(nonConformities.length + importedNCs.length + 1).padStart(3, '0')}`
            importedNCs.push({
              id: newId,
              source: `Internal Audit: ${audit.name || audit.id}`,
              description: finding.description || finding.issue || '',
              dateIdentified: audit.completedDate || new Date().toISOString().split('T')[0],
              relatedRequirement: finding.control || finding.requirement || '',
              severity: finding.severity || 'minor',
              status: 'identified',
              rootCauseMethod: '',
              rootCause: '',
              contributingFactors: '',
              correctiveAction: '',
              responsibleParty: '',
              targetDate: '',
              resourcesRequired: '',
              verificationMethod: '',
              verificationDate: '',
              verificationResult: 'pending',
              verifiedBy: '',
              customNotes: `Imported from ${audit.name || 'audit'} on ${new Date().toLocaleDateString()}`
            })
          })
        }
      })

      if (importedNCs.length === 0) {
        alert('No findings found in completed audits to import.')
        return
      }

      const updated = [...nonConformities, ...importedNCs]
      setNonConformities(updated)
      saveData(updated)
      alert(`Successfully imported ${importedNCs.length} non-conformit${importedNCs.length > 1 ? 'ies' : 'y'} from audit findings.`)
    } catch (error) {
      console.error('Error importing from audit:', error)
      alert('Error importing audit findings. Please try again.')
    }
  }

  const removeNonConformity = (id: string) => {
    const updated = nonConformities.filter(nc => nc.id !== id)
    setNonConformities(updated)
    if (selectedNC === id && updated.length > 0) {
      setSelectedNC(updated[0].id)
    }
    saveData(updated)
  }

  const updateNonConformity = (id: string, updates: Partial<NonConformity>) => {
    const updated = nonConformities.map(nc =>
      nc.id === id ? { ...nc, ...updates } : nc
    )
    setNonConformities(updated)
    saveData(updated)
  }

  const generateDocument = async () => {
    const organizationName = scopeData?.organizationName || 'Organization'
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Document Control Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1 },
              bottom: { style: BorderStyle.SINGLE, size: 1 },
              left: { style: BorderStyle.SINGLE, size: 1 },
              right: { style: BorderStyle.SINGLE, size: 1 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
              insideVertical: { style: BorderStyle.SINGLE, size: 1 },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: 'Document Title:', bold: true })],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ text: 'Corrective Actions Register' })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Document Owner:', bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'ISMS Manager' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Version:', bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: '1.0' })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Last Updated:', bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: today })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: 'Review Date:', bold: true })] }),
                  new TableCell({ children: [new Paragraph({ text: 'Annual' })] }),
                ],
              }),
            ],
          }),

          new Paragraph({ text: '', spacing: { after: 200 } }),

          // Title
          new Paragraph({
            text: 'Corrective Actions Register',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),

          new Paragraph({
            text: organizationName,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 400 }
          }),

          // Introduction
          new Paragraph({
            text: '1. Purpose',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 200 }
          }),

          new Paragraph({
            text: 'This document records all non-conformities identified within the Information Security Management System (ISMS) and tracks the corrective actions taken to address them. The purpose is to ensure systematic identification of root causes, implementation of effective corrective actions, and verification of their effectiveness as required by ISO 27001:2022 Clause 10.1.',
            spacing: { after: 200 }
          }),

          new Paragraph({
            text: '2. Non-Conformities and Corrective Actions',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),

          // Create detailed entries for each non-conformity
          ...nonConformities.flatMap((nc, index) => [
            new Paragraph({
              text: `2.${index + 1} ${nc.id}: ${nc.description || 'Non-conformity description'}`,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 300, after: 200 }
            }),

            // Non-Conformity Details Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1 },
                bottom: { style: BorderStyle.SINGLE, size: 1 },
                left: { style: BorderStyle.SINGLE, size: 1 },
                right: { style: BorderStyle.SINGLE, size: 1 },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                insideVertical: { style: BorderStyle.SINGLE, size: 1 },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 30, type: WidthType.PERCENTAGE },
                      children: [new Paragraph({ text: 'NC ID:', bold: true })],
                    }),
                    new TableCell({
                      width: { size: 70, type: WidthType.PERCENTAGE },
                      children: [new Paragraph({ text: nc.id })],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Source:', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: nc.source })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Date Identified:', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: nc.dateIdentified })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Severity:', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: nc.severity.toUpperCase() })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Status:', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: nc.status })] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ text: 'Related Requirement:', bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: nc.relatedRequirement || 'N/A' })] }),
                  ],
                }),
              ],
            }),

            new Paragraph({ text: '', spacing: { after: 200 } }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Description: ', bold: true }),
                new TextRun({ text: nc.description || 'Not specified' })
              ],
              spacing: { after: 200 }
            }),

            // Root Cause Analysis
            new Paragraph({
              text: 'Root Cause Analysis',
              bold: true,
              spacing: { before: 200, after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Method Used: ', bold: true }),
                new TextRun({ text: nc.rootCauseMethod || 'Not specified' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Root Cause: ', bold: true }),
                new TextRun({ text: nc.rootCause || 'Not yet analyzed' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Contributing Factors: ', bold: true }),
                new TextRun({ text: nc.contributingFactors || 'None identified' })
              ],
              spacing: { after: 200 }
            }),

            // Corrective Action
            new Paragraph({
              text: 'Corrective Action',
              bold: true,
              spacing: { before: 200, after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Action Description: ', bold: true }),
                new TextRun({ text: nc.correctiveAction || 'Not yet defined' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Responsible Party: ', bold: true }),
                new TextRun({ text: nc.responsibleParty || 'Not assigned' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Target Completion Date: ', bold: true }),
                new TextRun({ text: nc.targetDate || 'Not set' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Resources Required: ', bold: true }),
                new TextRun({ text: nc.resourcesRequired || 'Not specified' })
              ],
              spacing: { after: 200 }
            }),

            // Verification
            new Paragraph({
              text: 'Verification of Effectiveness',
              bold: true,
              spacing: { before: 200, after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Verification Method: ', bold: true }),
                new TextRun({ text: nc.verificationMethod || 'Not defined' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Verification Date: ', bold: true }),
                new TextRun({ text: nc.verificationDate || 'Not verified yet' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Result: ', bold: true }),
                new TextRun({ text: nc.verificationResult === 'pending' ? 'Pending' : nc.verificationResult === 'effective' ? 'EFFECTIVE' : 'NOT EFFECTIVE' })
              ],
              spacing: { after: 100 }
            }),

            new Paragraph({
              children: [
                new TextRun({ text: 'Verified By: ', bold: true }),
                new TextRun({ text: nc.verifiedBy || 'N/A' })
              ],
              spacing: { after: 100 }
            }),

            ...(nc.customNotes ? [
              new Paragraph({
                children: [
                  new TextRun({ text: 'Additional Notes: ', bold: true }),
                  new TextRun({ text: nc.customNotes })
                ],
                spacing: { after: 300 }
              })
            ] : [new Paragraph({ text: '', spacing: { after: 300 } })])
          ]),

          // Summary Statistics
          new Paragraph({
            text: '3. Summary Statistics',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Total Non-Conformities: ', bold: true }),
              new TextRun({ text: String(nonConformities.length) })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Critical: ', bold: true }),
              new TextRun({ text: String(nonConformities.filter(nc => nc.severity === 'critical').length) })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Major: ', bold: true }),
              new TextRun({ text: String(nonConformities.filter(nc => nc.severity === 'major').length) })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Minor: ', bold: true }),
              new TextRun({ text: String(nonConformities.filter(nc => nc.severity === 'minor').length) })
            ],
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Closed: ', bold: true }),
              new TextRun({ text: String(nonConformities.filter(nc => nc.status === 'closed').length) })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'In Progress: ', bold: true }),
              new TextRun({ text: String(nonConformities.filter(nc => nc.status !== 'closed' && nc.status !== 'identified').length) })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [
              new TextRun({ text: 'Open: ', bold: true }),
              new TextRun({ text: String(nonConformities.filter(nc => nc.status === 'identified').length) })
            ],
            spacing: { after: 400 }
          }),

          // Conclusion
          new Paragraph({
            text: '4. Conclusion',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 }
          }),

          new Paragraph({
            text: 'This corrective actions register demonstrates the organization\'s commitment to systematic identification and resolution of non-conformities within the ISMS. All corrective actions are tracked through to verification of their effectiveness, ensuring continuous improvement of the information security management system.',
            spacing: { after: 200 }
          }),
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Corrective_Actions_Register_${new Date().toISOString().split('T')[0]}.docx`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'major': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'minor': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'closed': return 'bg-green-100 text-green-800 border-green-200'
      case 'verifying': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'implementing': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'action-planned': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'analyzing': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'identified': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const selectedNCData = nonConformities.find(nc => nc.id === selectedNC)

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <RefreshCcw className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Corrective Actions - ISO 27001:2022 Clause 10.1</h3>
                <p className="text-sm text-blue-800 mb-3">
                  This component helps you manage non-conformities and corrective actions systematically. When a non-conformity is identified,
                  you must identify the root cause, implement corrective actions, and verify their effectiveness.
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Identify and document non-conformities from various sources</li>
                  <li>Analyze root causes using structured methods (5 Whys, Fishbone, etc.)</li>
                  <li>Plan and implement corrective actions</li>
                  <li>Verify the effectiveness of corrective actions</li>
                  <li>Maintain records for continual improvement</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Integration Status</h3>
              <div className="space-y-3">
                {[
                  { key: 'scope', label: 'Scope Definition', desc: 'Organizational context' },
                  { key: 'soa', label: 'Statement of Applicability', desc: 'Selected controls' },
                  { key: 'riskAssessment', label: 'Risk Assessment', desc: 'Risk data' },
                  { key: 'internalAudit', label: 'Internal Audit', desc: 'Audit findings' },
                  { key: 'managementReview', label: 'Management Review', desc: 'Review results' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{item.label}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    {integrationStatus[item.key as keyof typeof integrationStatus] ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> Non-conformities can be identified from internal audits, management reviews, monitoring activities,
                incidents, customer complaints, or any other source. Each must be addressed systematically to ensure continual improvement.
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Non-Conformity Register</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage all identified non-conformities. Click on a non-conformity to expand and edit details.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={addNonConformity}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Non-Conformity</span>
              </button>

              <button
                onClick={importFromAudit}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Import from Audit</span>
              </button>
            </div>

            <div className="space-y-3">
              {nonConformities.map(nc => (
                <div key={nc.id} className="border border-gray-200 rounded-lg bg-white">
                  {/* Non-Conformity Summary */}
                  <div
                    onClick={() => setSelectedNC(selectedNC === nc.id ? '' : nc.id)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedNC === nc.id ? 'border-b border-gray-200 bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-gray-900">{nc.id}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${getSeverityColor(nc.severity)}`}>
                          {nc.severity}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded border ${getStatusColor(nc.status)}`}>
                          {nc.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNonConformity(nc.id)
                          }}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                          selectedNC === nc.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">
                      {nc.description || 'No description provided'}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Source: {nc.source}</span>
                      <span>•</span>
                      <span>Date: {nc.dateIdentified}</span>
                    </div>
                  </div>

                  {/* Expanded Edit Form */}
                  {selectedNC === nc.id && (
                    <div className="p-6 bg-gray-50 space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Edit Non-Conformity Details</h4>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                          <select
                            value={nc.source}
                            onChange={(e) => updateNonConformity(nc.id, { source: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option>Internal Audit</option>
                            <option>External Audit</option>
                            <option>Management Review</option>
                            <option>Monitoring & Measurement</option>
                            <option>Security Incident</option>
                            <option>Customer Complaint</option>
                            <option>Self-Assessment</option>
                            <option>Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Date Identified</label>
                          <input
                            type="date"
                            value={nc.dateIdentified}
                            onChange={(e) => updateNonConformity(nc.id, { dateIdentified: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                          <select
                            value={nc.severity}
                            onChange={(e) => updateNonConformity(nc.id, { severity: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="minor">Minor</option>
                            <option value="major">Major</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                          <select
                            value={nc.status}
                            onChange={(e) => updateNonConformity(nc.id, { status: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="identified">Identified</option>
                            <option value="analyzing">Analyzing</option>
                            <option value="action-planned">Action Planned</option>
                            <option value="implementing">Implementing</option>
                            <option value="verifying">Verifying</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={nc.description}
                          onChange={(e) => updateNonConformity(nc.id, { description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          placeholder="Describe the non-conformity in detail..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Related ISO 27001 Requirement</label>
                        <input
                          type="text"
                          value={nc.relatedRequirement}
                          onChange={(e) => updateNonConformity(nc.id, { relatedRequirement: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          placeholder="e.g., ISO 27001:2022 Control A.8.15 - Logging"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Root Cause Analysis</h3>
              <p className="text-sm text-gray-600 mb-4">
                Analyze the root cause of each non-conformity using structured methods like 5 Whys, Fishbone Diagram, or other techniques.
              </p>
            </div>

            {selectedNCData && (
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">{selectedNCData.id}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded border ${getSeverityColor(selectedNCData.severity)}`}>
                        {selectedNCData.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{selectedNCData.description}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Method</label>
                    <select
                      value={selectedNCData.rootCauseMethod}
                      onChange={(e) => updateNonConformity(selectedNC, { rootCauseMethod: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a method...</option>
                      <option value="5 Whys">5 Whys</option>
                      <option value="Fishbone Diagram">Fishbone Diagram (Ishikawa)</option>
                      <option value="Fault Tree Analysis">Fault Tree Analysis</option>
                      <option value="Pareto Analysis">Pareto Analysis</option>
                      <option value="Root Cause Tree">Root Cause Tree</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Root Cause Identified</label>
                    <textarea
                      value={selectedNCData.rootCause}
                      onChange={(e) => updateNonConformity(selectedNC, { rootCause: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the fundamental cause that led to this non-conformity..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contributing Factors</label>
                    <textarea
                      value={selectedNCData.contributingFactors}
                      onChange={(e) => updateNonConformity(selectedNC, { contributingFactors: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="List any additional factors that contributed to the non-conformity..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const currentIndex = nonConformities.findIndex(nc => nc.id === selectedNC)
                      if (currentIndex > 0) {
                        setSelectedNC(nonConformities[currentIndex - 1].id)
                      }
                    }}
                    disabled={nonConformities.findIndex(nc => nc.id === selectedNC) === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous NC
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = nonConformities.findIndex(nc => nc.id === selectedNC)
                      if (currentIndex < nonConformities.length - 1) {
                        setSelectedNC(nonConformities[currentIndex + 1].id)
                      }
                    }}
                    disabled={nonConformities.findIndex(nc => nc.id === selectedNC) === nonConformities.length - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next NC
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Corrective Actions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Define corrective actions to address the root causes and prevent recurrence.
              </p>
            </div>

            {selectedNCData && (
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">{selectedNCData.id}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded border ${getSeverityColor(selectedNCData.severity)}`}>
                        {selectedNCData.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{selectedNCData.description}</p>
                  <p className="text-xs text-gray-600">
                    <strong>Root Cause:</strong> {selectedNCData.rootCause || 'Not analyzed yet'}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Corrective Action Description</label>
                    <textarea
                      value={selectedNCData.correctiveAction}
                      onChange={(e) => updateNonConformity(selectedNC, { correctiveAction: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the specific action(s) to be taken to eliminate the root cause and prevent recurrence..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Responsible Party</label>
                      <input
                        type="text"
                        value={selectedNCData.responsibleParty}
                        onChange={(e) => updateNonConformity(selectedNC, { responsibleParty: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Name or role"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Target Completion Date</label>
                      <input
                        type="date"
                        value={selectedNCData.targetDate}
                        onChange={(e) => updateNonConformity(selectedNC, { targetDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resources Required</label>
                    <textarea
                      value={selectedNCData.resourcesRequired}
                      onChange={(e) => updateNonConformity(selectedNC, { resourcesRequired: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Budget, personnel, tools, training, etc."
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const currentIndex = nonConformities.findIndex(nc => nc.id === selectedNC)
                      if (currentIndex > 0) {
                        setSelectedNC(nonConformities[currentIndex - 1].id)
                      }
                    }}
                    disabled={nonConformities.findIndex(nc => nc.id === selectedNC) === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous NC
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = nonConformities.findIndex(nc => nc.id === selectedNC)
                      if (currentIndex < nonConformities.length - 1) {
                        setSelectedNC(nonConformities[currentIndex + 1].id)
                      }
                    }}
                    disabled={nonConformities.findIndex(nc => nc.id === selectedNC) === nonConformities.length - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next NC
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Verification & Export</h3>
              <p className="text-sm text-gray-600 mb-4">
                Verify the effectiveness of corrective actions and export the complete corrective actions register.
              </p>
            </div>

            {selectedNCData && (
              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-medium text-gray-900">{selectedNCData.id}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded border ${getSeverityColor(selectedNCData.severity)}`}>
                        {selectedNCData.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{selectedNCData.description}</p>
                  <p className="text-xs text-gray-600 mb-1">
                    <strong>Corrective Action:</strong> {selectedNCData.correctiveAction || 'Not defined yet'}
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Target Date:</strong> {selectedNCData.targetDate || 'Not set'}
                  </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verification Method</label>
                    <textarea
                      value={selectedNCData.verificationMethod}
                      onChange={(e) => updateNonConformity(selectedNC, { verificationMethod: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe how the effectiveness of the corrective action will be verified (e.g., review logs, re-audit, monitoring data, etc.)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verification Date</label>
                      <input
                        type="date"
                        value={selectedNCData.verificationDate}
                        onChange={(e) => updateNonConformity(selectedNC, { verificationDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Verification Result</label>
                      <select
                        value={selectedNCData.verificationResult}
                        onChange={(e) => updateNonConformity(selectedNC, { verificationResult: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="effective">Effective</option>
                        <option value="not-effective">Not Effective</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Verified By</label>
                    <input
                      type="text"
                      value={selectedNCData.verifiedBy}
                      onChange={(e) => updateNonConformity(selectedNC, { verifiedBy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Name or role of person who verified"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                    <textarea
                      value={selectedNCData.customNotes}
                      onChange={(e) => updateNonConformity(selectedNC, { customNotes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any additional information or observations..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const currentIndex = nonConformities.findIndex(nc => nc.id === selectedNC)
                      if (currentIndex > 0) {
                        setSelectedNC(nonConformities[currentIndex - 1].id)
                      }
                    }}
                    disabled={nonConformities.findIndex(nc => nc.id === selectedNC) === 0}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous NC
                  </button>
                  <button
                    onClick={() => {
                      const currentIndex = nonConformities.findIndex(nc => nc.id === selectedNC)
                      if (currentIndex < nonConformities.length - 1) {
                        setSelectedNC(nonConformities[currentIndex + 1].id)
                      }
                    }}
                    disabled={nonConformities.findIndex(nc => nc.id === selectedNC) === nonConformities.length - 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next NC
                  </button>
                </div>
              </div>
            )}

            {/* Summary Statistics */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Summary Statistics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{nonConformities.length}</div>
                  <div className="text-sm text-gray-600">Total NCs</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-900">
                    {nonConformities.filter(nc => nc.severity === 'critical').length}
                  </div>
                  <div className="text-sm text-red-600">Critical</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-900">
                    {nonConformities.filter(nc => nc.severity === 'major').length}
                  </div>
                  <div className="text-sm text-orange-600">Major</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-900">
                    {nonConformities.filter(nc => nc.status === 'closed').length}
                  </div>
                  <div className="text-sm text-green-600">Closed</div>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <Download className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-2">Export Corrective Actions Register</h4>
                  <p className="text-sm text-blue-800 mb-4">
                    Generate a comprehensive Word document containing all non-conformities, root cause analyses,
                    corrective actions, and verification records.
                  </p>
                  <button
                    onClick={generateDocument}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Corrective Actions Register</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Corrective Actions</h1>
        <p className="text-gray-600">
          Systematically manage non-conformities and corrective actions - ISO 27001:2022 Clause 10.1
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, title: 'Overview', icon: FileText },
            { num: 2, title: 'Non-Conformities', icon: AlertTriangle },
            { num: 3, title: 'Root Cause', icon: Search },
            { num: 4, title: 'Actions', icon: RefreshCcw },
            { num: 5, title: 'Verification', icon: CheckCircle }
          ].map((step, index) => {
            const Icon = step.icon
            return (
              <React.Fragment key={step.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                      currentStep === step.num
                        ? 'bg-blue-600 text-white'
                        : currentStep > step.num
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center">{step.title}</span>
                </div>
                {index < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-colors ${
                      currentStep > step.num ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                    style={{ marginTop: '-20px' }}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
          disabled={currentStep === 5}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default CorrectiveActions
