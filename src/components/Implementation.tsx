import React, { useState, useEffect } from 'react'
import { Settings, CheckCircle, Clock, AlertTriangle, PlayCircle, Users, FileCheck, BarChart3, Download, Calendar, Target, Shield, Zap, Edit, Save, X, Plus } from 'lucide-react'

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

interface ImplementationProps {
  scopeData: ScopeData | null
}

interface ControlImplementation {
  id: string
  category: string
  control: string
  description: string
  status: 'not-started' | 'planning' | 'in-progress' | 'testing' | 'completed' | 'delayed'
  priority: 'critical' | 'high' | 'medium' | 'low'
  assignedTo: string
  dueDate: string
  progress: number
  lastUpdated: string
  notes: string
  evidence: string[]
  dependencies: string[]
  cost: number
  effort: string
}

interface ImplementationPhase {
  id: string
  name: string
  description: string
  status: 'not-started' | 'in-progress' | 'completed'
  progress: number
  controls: string[]
  startDate?: string
  endDate?: string
}

const Implementation: React.FC<ImplementationProps> = ({ scopeData }) => {
  const [implementations, setImplementations] = useState<ControlImplementation[]>([])
  const [phases, setPhases] = useState<ImplementationPhase[]>([])
  const [selectedControl, setSelectedControl] = useState<string | null>(null)
  const [activePhase, setActivePhase] = useState<string>('planning')
  const [showAddControl, setShowAddControl] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [editingControl, setEditingControl] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<ControlImplementation>>({})

  // Initialize implementation phases
  useEffect(() => {
    const defaultPhases: ImplementationPhase[] = [
      {
        id: 'planning',
        name: 'Document Creation & Planning',
        description: 'Create mandatory ISO 27001 documents, policies, and procedures required for compliance',
        status: 'in-progress',
        progress: 65,
        controls: ['A.5.1', 'A.12.1', 'A.14.1'],
        startDate: '2024-01-15',
        endDate: '2024-02-28'
      },
      {
        id: 'foundation',
        name: 'Organizational Controls',
        description: 'Implement organizational policies, roles, responsibilities and governance structures',
        status: 'in-progress',
        progress: 40,
        controls: ['A.5.2', 'A.5.3', 'A.6.1', 'A.7.1'],
        startDate: '2024-02-01',
        endDate: '2024-03-31'
      },
      {
        id: 'technical',
        name: 'Technical Security Controls',
        description: 'Deploy technical security controls, systems, and infrastructure changes',
        status: 'not-started',
        progress: 0,
        controls: ['A.8.1', 'A.9.1', 'A.10.1', 'A.13.1'],
        startDate: '2024-03-15',
        endDate: '2024-05-31'
      },
      {
        id: 'operational',
        name: 'Process Implementation & Training',
        description: 'Change business processes, train staff, and establish operational procedures',
        status: 'not-started',
        progress: 0,
        controls: ['A.11.1', 'A.12.2', 'A.15.1', 'A.16.1'],
        startDate: '2024-05-01',
        endDate: '2024-06-30'
      }
    ]
    setPhases(defaultPhases)
  }, [])

  // Sample implementation data
  useEffect(() => {
    const sampleImplementations: ControlImplementation[] = [
      {
        id: 'A.5.1',
        category: 'Organization of Information Security',
        control: 'Information Security Policy',
        description: 'Create and implement comprehensive information security policy document and obtain management approval',
        status: 'completed',
        priority: 'critical',
        assignedTo: 'Security Team',
        dueDate: '2024-02-15',
        progress: 100,
        lastUpdated: '2024-02-10',
        notes: 'Policy document created, approved by executive team, and published organization-wide. Staff training initiated.',
        evidence: ['IS-POL-001-v1.0.pdf', 'Board-Approval-Email.msg'],
        dependencies: [],
        cost: 5000,
        effort: '2 weeks'
      },
      {
        id: 'A.6.1',
        category: 'Human Resource Security',
        control: 'Screening',
        description: 'Background verification of all candidates',
        status: 'in-progress',
        priority: 'high',
        assignedTo: 'HR Department',
        dueDate: '2024-03-01',
        progress: 70,
        lastUpdated: '2024-02-20',
        notes: 'Screening procedure documented, awaiting legal review. HR team training on new process scheduled.',
        evidence: ['HR-SCREEN-PROC-v0.9.docx'],
        dependencies: ['A.5.1'],
        cost: 15000,
        effort: '4 weeks'
      },
      {
        id: 'A.8.1',
        category: 'Asset Management',
        control: 'Inventory of Assets',
        description: 'Maintain an inventory of information assets',
        status: 'planning',
        priority: 'high',
        assignedTo: 'IT Operations',
        dueDate: '2024-03-15',
        progress: 25,
        lastUpdated: '2024-02-18',
        notes: 'Asset discovery tools evaluated and purchased. Implementation plan developed, staff training scheduled.',
        evidence: [],
        dependencies: ['A.5.1'],
        cost: 25000,
        effort: '6 weeks'
      },
      {
        id: 'A.9.1',
        category: 'Access Control',
        control: 'Access Control Policy',
        description: 'Establish access control policy and procedures',
        status: 'delayed',
        priority: 'critical',
        assignedTo: 'Security Team',
        dueDate: '2024-02-28',
        progress: 15,
        lastUpdated: '2024-02-22',
        notes: 'Delayed due to resource constraints, need additional security architect',
        evidence: [],
        dependencies: ['A.5.1', 'A.8.1'],
        cost: 20000,
        effort: '5 weeks'
      },
      {
        id: 'A.12.1',
        category: 'Operations Security',
        control: 'Operational Procedures',
        description: 'Document and maintain operational procedures',
        status: 'testing',
        priority: 'medium',
        assignedTo: 'Operations Team',
        dueDate: '2024-03-10',
        progress: 85,
        lastUpdated: '2024-02-25',
        notes: 'Procedures documented and staff trained. Currently in pilot testing phase with operations team.',
        evidence: ['OPS-PROC-v1.0.pdf', 'Pilot-Test-Results.xlsx'],
        dependencies: ['A.5.1'],
        cost: 10000,
        effort: '3 weeks'
      }
    ]
    setImplementations(sampleImplementations)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in-progress':
        return <PlayCircle className="w-5 h-5 text-blue-500" />
      case 'testing':
        return <Zap className="w-5 h-5 text-purple-500" />
      case 'planning':
        return <Target className="w-5 h-5 text-orange-500" />
      case 'delayed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-50 border-green-200'
      case 'in-progress':
        return 'text-blue-700 bg-blue-50 border-blue-200'
      case 'testing':
        return 'text-purple-700 bg-purple-50 border-purple-200'
      case 'planning':
        return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'delayed':
        return 'text-red-700 bg-red-50 border-red-200'
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-700 bg-red-100'
      case 'high':
        return 'text-orange-700 bg-orange-100'
      case 'medium':
        return 'text-yellow-700 bg-yellow-100'
      case 'low':
        return 'text-green-700 bg-green-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const filteredImplementations = implementations.filter(impl => {
    const statusMatch = filterStatus === 'all' || impl.status === filterStatus
    const priorityMatch = filterPriority === 'all' || impl.priority === filterPriority
    return statusMatch && priorityMatch
  })

  const overallProgress = implementations.length > 0
    ? Math.round(implementations.reduce((sum, impl) => sum + impl.progress, 0) / implementations.length)
    : 0

  const statusCounts = implementations.reduce((acc, impl) => {
    acc[impl.status] = (acc[impl.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const exportImplementationPlan = () => {
    const csvContent = [
      ['Control ID', 'Category', 'Control', 'Status', 'Priority', 'Assigned To', 'Due Date', 'Progress', 'Cost', 'Effort'],
      ...implementations.map(impl => [
        impl.id,
        impl.category,
        impl.control,
        impl.status,
        impl.priority,
        impl.assignedTo,
        impl.dueDate,
        `${impl.progress}%`,
        `$${impl.cost}`,
        impl.effort
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'isms-implementation-plan.csv'
    a.click()
  }

  const startEditControl = (control: ControlImplementation) => {
    setEditingControl(control.id)
    setEditForm({
      status: control.status,
      priority: control.priority,
      assignedTo: control.assignedTo,
      dueDate: control.dueDate,
      progress: control.progress,
      notes: control.notes,
      cost: control.cost,
      effort: control.effort
    })
  }

  const cancelEdit = () => {
    setEditingControl(null)
    setEditForm({})
  }

  const saveControl = () => {
    if (!editingControl) return

    setImplementations(prev => prev.map(impl =>
      impl.id === editingControl
        ? {
            ...impl,
            ...editForm,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : impl
    ))
    setEditingControl(null)
    setEditForm({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl p-6" style={{backgroundColor: '#7c3aed', color: 'white'}}>
        <div className="flex items-center gap-3 mb-4">
          <Settings className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Implement the Security Controls</h2>
        </div>
        <p className="text-purple-100 mb-4">
          This is where you implement all documents and technology, and consequently change the security processes in your company. This is usually the most difficult task as it means enforcing new behavior in your organization and often requires new policies and procedures.
        </p>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{implementations.length}</div>
            <div className="text-sm" style={{color: '#e9d5ff'}}>Total Controls</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{statusCounts.completed || 0}</div>
            <div className="text-sm" style={{color: '#e9d5ff'}}>Completed</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{(statusCounts['in-progress'] || 0) + (statusCounts.testing || 0)}</div>
            <div className="text-sm" style={{color: '#e9d5ff'}}>In Progress</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{overallProgress}%</div>
            <div className="text-sm" style={{color: '#e9d5ff'}}>Overall Progress</div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={exportImplementationPlan}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="w-5 h-5" />
            Export Implementation Plan
          </button>
        </div>
      </div>

      {/* Implementation Phases */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Security Control Implementation Phases
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                activePhase === phase.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActivePhase(phase.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{phase.name}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(phase.status)}`}>
                  {phase.status.replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{phase.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${phase.progress}%` }}
                  ></div>
                </div>
                {phase.startDate && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Start: {new Date(phase.startDate).toLocaleDateString()}</span>
                    <span>End: {new Date(phase.endDate!).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Control Implementation Status
          </h3>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="not-started">Not Started</option>
              <option value="planning">Planning</option>
              <option value="in-progress">In Progress</option>
              <option value="testing">Testing</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredImplementations.map((impl) => (
            <div
              key={impl.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedControl === impl.id ? 'border-purple-300 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedControl(selectedControl === impl.id ? null : impl.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(impl.status)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{impl.id}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(impl.priority)}`}>
                        {impl.priority}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-800">{impl.control}</h4>
                    <p className="text-sm text-gray-600">{impl.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(impl.status)}`}>
                      {impl.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">Due: {new Date(impl.dueDate).toLocaleDateString()}</div>
                  <div className="text-sm font-medium text-gray-900">{impl.progress}% Complete</div>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      impl.status === 'completed' ? 'bg-green-500' :
                      impl.status === 'delayed' ? 'bg-red-500' :
                      'bg-purple-600'
                    }`}
                    style={{ width: `${impl.progress}%` }}
                  ></div>
                </div>
              </div>

              {selectedControl === impl.id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">Control Details</h4>
                    {editingControl !== impl.id ? (
                      <button
                        onClick={() => startEditControl(impl)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={saveControl}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">Description</h5>
                    <p className="text-sm text-gray-600">{impl.description}</p>
                  </div>

                  {editingControl === impl.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={editForm.status || ''}
                          onChange={(e) => setEditForm({...editForm, status: e.target.value as ControlImplementation['status']})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="planning">Planning</option>
                          <option value="in-progress">In Progress</option>
                          <option value="testing">Testing</option>
                          <option value="completed">Completed</option>
                          <option value="delayed">Delayed</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          value={editForm.priority || ''}
                          onChange={(e) => setEditForm({...editForm, priority: e.target.value as ControlImplementation['priority']})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        >
                          <option value="critical">Critical</option>
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                        <input
                          type="text"
                          value={editForm.assignedTo || ''}
                          onChange={(e) => setEditForm({...editForm, assignedTo: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input
                          type="date"
                          value={editForm.dueDate || ''}
                          onChange={(e) => setEditForm({...editForm, dueDate: e.target.value})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={editForm.progress || 0}
                          onChange={(e) => setEditForm({...editForm, progress: parseInt(e.target.value)})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                        <input
                          type="number"
                          min="0"
                          value={editForm.cost || 0}
                          onChange={(e) => setEditForm({...editForm, cost: parseInt(e.target.value)})}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Effort Estimate</label>
                        <input
                          type="text"
                          value={editForm.effort || ''}
                          onChange={(e) => setEditForm({...editForm, effort: e.target.value})}
                          placeholder="e.g., 3 weeks"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea
                          value={editForm.notes || ''}
                          onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                          rows={3}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Assigned To</h5>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {impl.assignedTo}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Effort Estimate</h5>
                        <p className="text-sm text-gray-600">{impl.effort} (${impl.cost.toLocaleString()})</p>
                      </div>
                    </div>
                  )}

                  {impl.notes && editingControl !== impl.id && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Notes</h5>
                      <p className="text-sm text-gray-600">{impl.notes}</p>
                    </div>
                  )}

                  {impl.evidence.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Evidence</h5>
                      <div className="flex flex-wrap gap-2">
                        {impl.evidence.map((evidence, index) => (
                          <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            <FileCheck className="w-3 h-3" />
                            {evidence}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {impl.dependencies.length > 0 && (
                    <div>
                      <h5 className="font-medium text-gray-900 mb-1">Dependencies</h5>
                      <div className="flex flex-wrap gap-2">
                        {impl.dependencies.map((dep, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {dep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Last updated: {new Date(impl.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Progress by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(status)}
                  <span className="text-sm capitalize">{status.replace('-', ' ')}</span>
                </div>
                <span className="font-medium">{count} controls</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Implementation Timeline</h3>
          <div className="space-y-3">
            <div className="text-sm text-gray-600">
              <strong>Total Budget:</strong> ${implementations.reduce((sum, impl) => sum + impl.cost, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Controls at Risk:</strong> {statusCounts.delayed || 0} delayed
            </div>
            <div className="text-sm text-gray-600">
              <strong>Next Milestone:</strong> Organizational Controls completion (March 31)
            </div>
            <div className="text-sm text-gray-600">
              <strong>Expected Completion:</strong> All security controls implemented by June 30, 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Implementation