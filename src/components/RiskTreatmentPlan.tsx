import React, { useState, useEffect } from 'react'
import { Calendar, Users, DollarSign, Target, CheckCircle, Clock, AlertTriangle, Download, Plus, Edit2, Trash2, X } from 'lucide-react'
import iso27001AnnexAControls from '../../soa-controls'

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

interface Treatment {
  riskId: string
  strategy: 'mitigate' | 'transfer' | 'avoid' | 'accept'
  selectedControls: string[]
  justification: string
  owner: string
  deadline: string
  cost: string
  notes: string
}

interface ControlPlan {
  controlId: string
  controlTitle: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  implementationPhase: 'phase-1' | 'phase-2' | 'phase-3' | 'ongoing'
  assignedTo: string
  estimatedCost: string
  startDate: string
  targetDate: string
  actualStartDate?: string
  actualEndDate?: string
  status: 'not-started' | 'in-planning' | 'in-progress' | 'testing' | 'completed' | 'on-hold'
  dependencies: string[]
  resources: string[]
  milestones: Array<{
    id: string
    description: string
    targetDate: string
    completed: boolean
    completedDate?: string
  }>
  notes: string
  riskIds: string[]
}

interface RiskTreatmentPlanProps {
  scopeData: ScopeData | null
}

const RiskTreatmentPlan: React.FC<RiskTreatmentPlanProps> = ({ scopeData }) => {
  const [controlPlans, setControlPlans] = useState<ControlPlan[]>([])
  const [selectedControl, setSelectedControl] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPhase, setFilterPhase] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [availableControls, setAvailableControls] = useState<Array<{id: string, title: string, riskIds: string[]}>>([])

  useEffect(() => {
    loadAvailableControls()
    loadExistingPlans()
  }, [])

  const loadAvailableControls = () => {
    // Load controls from Risk Treatment and SOA
    const savedTreatments = localStorage.getItem('riskTreatments')
    const savedSOA = localStorage.getItem('statementOfApplicability')

    if (savedTreatments && savedSOA) {
      try {
        const treatments: Treatment[] = JSON.parse(savedTreatments)
        const soaData = JSON.parse(savedSOA)

        // Get all selected controls from treatments
        const treatmentControls = treatments.flatMap(treatment =>
          treatment.selectedControls.map(controlId => ({
            id: controlId,
            riskIds: [treatment.riskId]
          }))
        )

        // Group by control ID and collect risk IDs
        const controlMap = new Map<string, string[]>()
        treatmentControls.forEach(tc => {
          const existing = controlMap.get(tc.id) || []
          controlMap.set(tc.id, [...existing, ...tc.riskIds])
        })

        // Get control titles from SOA
        const controlsWithTitles = Array.from(controlMap.entries()).map(([controlId, riskIds]) => {
          const soaEntry = soaData.find((soa: any) => soa.controlId === controlId)
          // Find control title from imported controls or fallback
          const controlTitle = getControlTitle(controlId)

          return {
            id: controlId,
            title: controlTitle,
            riskIds: [...new Set(riskIds)]
          }
        })

        setAvailableControls(controlsWithTitles)
      } catch (error) {
        console.error('Error loading available controls:', error)
      }
    }
  }

  const getControlTitle = (controlId: string): string => {
    const control = iso27001AnnexAControls.find(c => c.id === controlId)
    return control ? control.title : `${controlId} - Security Control`
  }

  const loadExistingPlans = () => {
    const savedPlans = localStorage.getItem('riskTreatmentPlans')
    if (savedPlans) {
      try {
        const plans = JSON.parse(savedPlans)
        setControlPlans(plans)
      } catch (error) {
        console.error('Error loading treatment plans:', error)
      }
    }
  }

  const saveControlPlan = (plan: ControlPlan) => {
    const updatedPlans = controlPlans.filter(cp => cp.controlId !== plan.controlId)
    updatedPlans.push(plan)
    setControlPlans(updatedPlans)
    localStorage.setItem('riskTreatmentPlans', JSON.stringify(updatedPlans))
    setSelectedControl(null)
  }

  const deleteControlPlan = (controlId: string) => {
    const updatedPlans = controlPlans.filter(cp => cp.controlId !== controlId)
    setControlPlans(updatedPlans)
    localStorage.setItem('riskTreatmentPlans', JSON.stringify(updatedPlans))
  }

  const createPlanForControl = (control: {id: string, title: string, riskIds: string[]}) => {
    const newPlan: ControlPlan = {
      controlId: control.id,
      controlTitle: control.title,
      priority: 'medium',
      implementationPhase: 'phase-1',
      assignedTo: '',
      estimatedCost: '',
      startDate: '',
      targetDate: '',
      status: 'not-started',
      dependencies: [],
      resources: [],
      milestones: [],
      notes: '',
      riskIds: control.riskIds
    }
    setSelectedControl(control.id)
    // Pre-populate form with new plan
    const updatedPlans = [...controlPlans.filter(cp => cp.controlId !== control.id), newPlan]
    setControlPlans(updatedPlans)
  }

  const getFilteredControls = () => {
    let filtered = availableControls

    if (searchTerm) {
      filtered = filtered.filter(control =>
        control.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  const getFilteredPlans = () => {
    let filtered = controlPlans

    if (filterPhase !== 'all') {
      filtered = filtered.filter(plan => plan.implementationPhase === filterPhase)
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(plan => plan.status === filterStatus)
    }

    if (filterPriority !== 'all') {
      filtered = filtered.filter(plan => plan.priority === filterPriority)
    }

    return filtered
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'in-progress':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'testing':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'on-hold':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'in-planning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const exportTreatmentPlan = () => {
    const data = {
      organization: scopeData?.organizationName || 'Organization',
      generatedDate: new Date().toLocaleDateString(),
      totalControls: controlPlans.length,
      controlPlans: controlPlans,
      summary: {
        byPhase: {
          'phase-1': controlPlans.filter(cp => cp.implementationPhase === 'phase-1').length,
          'phase-2': controlPlans.filter(cp => cp.implementationPhase === 'phase-2').length,
          'phase-3': controlPlans.filter(cp => cp.implementationPhase === 'phase-3').length,
          'ongoing': controlPlans.filter(cp => cp.implementationPhase === 'ongoing').length
        },
        byStatus: {
          'not-started': controlPlans.filter(cp => cp.status === 'not-started').length,
          'in-planning': controlPlans.filter(cp => cp.status === 'in-planning').length,
          'in-progress': controlPlans.filter(cp => cp.status === 'in-progress').length,
          'testing': controlPlans.filter(cp => cp.status === 'testing').length,
          'completed': controlPlans.filter(cp => cp.status === 'completed').length,
          'on-hold': controlPlans.filter(cp => cp.status === 'on-hold').length
        },
        byPriority: {
          'critical': controlPlans.filter(cp => cp.priority === 'critical').length,
          'high': controlPlans.filter(cp => cp.priority === 'high').length,
          'medium': controlPlans.filter(cp => cp.priority === 'medium').length,
          'low': controlPlans.filter(cp => cp.priority === 'low').length
        }
      }
    }

    const markdown = `# Risk Treatment Plan
## ${data.organization}
**Generated:** ${data.generatedDate}

## Executive Summary

This Risk Treatment Plan defines the implementation approach for ${data.totalControls} security controls selected through our risk assessment and treatment process.

### Implementation Phases
- **Phase 1 (Critical):** ${data.summary.byPhase['phase-1']} controls
- **Phase 2 (High Priority):** ${data.summary.byPhase['phase-2']} controls
- **Phase 3 (Standard):** ${data.summary.byPhase['phase-3']} controls
- **Ongoing Operations:** ${data.summary.byPhase.ongoing} controls

### Current Status
- **Not Started:** ${data.summary.byStatus['not-started']} controls
- **In Planning:** ${data.summary.byStatus['in-planning']} controls
- **In Progress:** ${data.summary.byStatus['in-progress']} controls
- **Testing:** ${data.summary.byStatus.testing} controls
- **Completed:** ${data.summary.byStatus.completed} controls
- **On Hold:** ${data.summary.byStatus['on-hold']} controls

## Implementation Plans

${controlPlans.map(plan => `
### ${plan.controlId}: ${plan.controlTitle}

**Priority:** ${plan.priority.toUpperCase()}
**Phase:** ${plan.implementationPhase.replace('-', ' ').toUpperCase()}
**Status:** ${plan.status.replace('-', ' ').toUpperCase()}
**Assigned To:** ${plan.assignedTo || 'Not assigned'}
**Estimated Cost:** ${plan.estimatedCost || 'Not estimated'}

**Timeline:**
- Start Date: ${plan.startDate || 'Not set'}
- Target Date: ${plan.targetDate || 'Not set'}
${plan.actualStartDate ? `- Actual Start: ${plan.actualStartDate}` : ''}
${plan.actualEndDate ? `- Actual End: ${plan.actualEndDate}` : ''}

**Associated Risks:** ${plan.riskIds.join(', ') || 'None'}

${plan.dependencies.length > 0 ? `**Dependencies:** ${plan.dependencies.join(', ')}` : ''}

${plan.resources.length > 0 ? `**Required Resources:** ${plan.resources.join(', ')}` : ''}

${plan.milestones.length > 0 ? `**Milestones:**
${plan.milestones.map(m => `- ${m.description} (Target: ${m.targetDate}) ${m.completed ? '✅' : '⏳'}`).join('\n')}` : ''}

${plan.notes ? `**Notes:** ${plan.notes}` : ''}

---
`).join('')}

## Next Steps

1. Review and approve this treatment plan
2. Allocate necessary resources and budget
3. Begin Phase 1 implementations
4. Establish regular progress review meetings
5. Update this plan as implementation progresses

*This document was generated by the ISMS application and should be reviewed by management.*
`

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `risk-treatment-plan-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredPlans = getFilteredPlans()
  const filteredControls = getFilteredControls()
  const unplannedControls = filteredControls.filter(control =>
    !controlPlans.some(plan => plan.controlId === control.id)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl p-6" style={{backgroundColor: '#14532d', color: 'white'}}>
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Risk Treatment Plan</h2>
        </div>
        <p className="text-green-100 mb-4">
          Define implementation details, timelines, resources, and responsibilities for selected security controls.
        </p>
        <div className="grid grid-cols-4 gap-4 text-center text-white">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{controlPlans.length}</div>
            <div className="text-sm font-medium" style={{color: '#dcfce7'}}>Planned Controls</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>
              {controlPlans.filter(cp => cp.status === 'completed').length}
            </div>
            <div className="text-sm font-medium" style={{color: '#dcfce7'}}>Completed</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>
              {controlPlans.filter(cp => cp.status === 'in-progress').length}
            </div>
            <div className="text-sm font-medium" style={{color: '#dcfce7'}}>In Progress</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{unplannedControls.length}</div>
            <div className="text-sm font-medium" style={{color: '#dcfce7'}}>Need Planning</div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={exportTreatmentPlan}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Treatment Plan
          </button>
        </div>
      </div>

      {/* Unplanned Controls */}
      {unplannedControls.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-900">Controls Requiring Planning</h3>
          </div>
          <p className="text-yellow-700 mb-4">
            The following controls were selected in risk treatment but don't have implementation plans yet.
          </p>
          <div className="space-y-4">
            {unplannedControls.map(control => (
              <div key={control.id} className="space-y-3">
                <div className="bg-white rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{control.id}</h4>
                      <p className="text-sm text-gray-600">{control.title}</p>
                      <p className="text-xs text-gray-500">
                        Addresses risks: {control.riskIds.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => createPlanForControl(control)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Plan
                    </button>
                  </div>
                </div>
                {selectedControl === control.id && (
                  <div className="ml-4">
                    <InlineEditForm
                      plan={controlPlans.find(cp => cp.controlId === control.id)!}
                      onSave={(updatedPlan) => {
                        saveControlPlan(updatedPlan)
                        setSelectedControl(null)
                      }}
                      onCancel={() => setSelectedControl(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Controls</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by control ID or title..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phase</label>
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Phases</option>
              <option value="phase-1">Phase 1</option>
              <option value="phase-2">Phase 2</option>
              <option value="phase-3">Phase 3</option>
              <option value="ongoing">Ongoing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="in-planning">In Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Control Plans */}
      <div className="space-y-4">
        {filteredPlans.length === 0 && controlPlans.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            No control plans match your current filters.
          </div>
        )}

        {filteredPlans.length === 0 && controlPlans.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No control plans created yet. Start by creating plans for controls that need planning above.
          </div>
        )}

        {filteredPlans.map(plan => (
          <div key={plan.controlId} className="bg-white rounded-xl border border-gray-200 p-6">
            {selectedControl === plan.controlId ? (
              <InlineEditForm
                plan={plan}
                onSave={(updatedPlan) => {
                  saveControlPlan(updatedPlan)
                  setSelectedControl(null)
                }}
                onCancel={() => setSelectedControl(null)}
              />
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {plan.controlId}: {plan.controlTitle}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(plan.priority)}`}>
                        {plan.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(plan.status)}`}>
                        {plan.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Phase:</span> {plan.implementationPhase.replace('-', ' ')}
                      </div>
                      <div>
                        <span className="font-medium">Assigned:</span> {plan.assignedTo || 'Not assigned'}
                      </div>
                      <div>
                        <span className="font-medium">Target:</span> {plan.targetDate || 'Not set'}
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span> {plan.estimatedCost || 'Not estimated'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedControl(plan.controlId)}
                      className="text-green-600 hover:text-green-700 p-1"
                      title="Edit plan"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteControlPlan(plan.controlId)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {plan.milestones.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Milestones</h4>
                    <div className="space-y-2">
                      {plan.milestones.map(milestone => (
                        <div key={milestone.id} className="flex items-center gap-3 text-sm">
                          {milestone.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          <span className={milestone.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                            {milestone.description}
                          </span>
                          <span className="text-gray-500">({milestone.targetDate})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {plan.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                    <p className="text-sm text-gray-600">{plan.notes}</p>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}

// Inline Edit Form Component
interface InlineEditFormProps {
  plan: ControlPlan
  onSave: (plan: ControlPlan) => void
  onCancel: () => void
}

const InlineEditForm: React.FC<InlineEditFormProps> = ({ plan, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ControlPlan>(plan)

  const handleSave = () => {
    onSave(formData)
  }

  const addMilestone = () => {
    const newMilestone = {
      id: Date.now().toString(),
      description: '',
      targetDate: '',
      completed: false
    }
    setFormData({
      ...formData,
      milestones: [...formData.milestones, newMilestone]
    })
  }

  const updateMilestone = (id: string, updates: Partial<typeof formData.milestones[0]>) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.map(m =>
        m.id === id ? { ...m, ...updates } : m
      )
    })
  }

  const removeMilestone = (id: string) => {
    setFormData({
      ...formData,
      milestones: formData.milestones.filter(m => m.id !== id)
    })
  }

  return (
    <div className="border-2 border-green-200 rounded-lg bg-green-50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Edit: {formData.controlId}: {formData.controlTitle}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phase</label>
          <select
            value={formData.implementationPhase}
            onChange={(e) => setFormData({ ...formData, implementationPhase: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="phase-1">Phase 1</option>
            <option value="phase-2">Phase 2</option>
            <option value="phase-3">Phase 3</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          >
            <option value="not-started">Not Started</option>
            <option value="in-planning">In Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="testing">Testing</option>
            <option value="completed">Completed</option>
            <option value="on-hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
          <input
            type="text"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="Person or team"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
          <input
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
          <input
            type="text"
            value={formData.estimatedCost}
            onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
            placeholder="e.g., $5,000 or 40 hours"
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dependencies</label>
          <textarea
            value={formData.dependencies.join('\n')}
            onChange={(e) => setFormData({
              ...formData,
              dependencies: e.target.value.split('\n').filter(d => d.trim())
            })}
            placeholder="One per line"
            rows={2}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
          />
        </div>
      </div>

      {/* Milestones Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">Milestones</label>
          <button
            onClick={addMilestone}
            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {formData.milestones.map(milestone => (
            <div key={milestone.id} className="flex items-center gap-2 p-2 bg-white rounded border">
              <input
                type="checkbox"
                checked={milestone.completed}
                onChange={(e) => updateMilestone(milestone.id, {
                  completed: e.target.checked,
                  completedDate: e.target.checked ? new Date().toISOString().split('T')[0] : undefined
                })}
                className="w-3 h-3 text-green-600"
              />
              <input
                type="text"
                value={milestone.description}
                onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                placeholder="Milestone description"
                className="flex-1 p-1 border border-gray-300 rounded text-sm"
              />
              <input
                type="date"
                value={milestone.targetDate}
                onChange={(e) => updateMilestone(milestone.id, { targetDate: e.target.value })}
                className="p-1 border border-gray-300 rounded text-sm"
              />
              <button
                onClick={() => removeMilestone(milestone.id)}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notes Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Implementation Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about implementation approach, challenges, or considerations..."
          rows={3}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
        />
      </div>
    </div>
  )
}

export default RiskTreatmentPlan