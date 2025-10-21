import React, { useState, useEffect } from 'react'
import { Target, Shield, CheckCircle, AlertTriangle, BarChart3, TrendingUp, Clock, FileText, Users, Calendar, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DashboardProps {
  onNavigate: (stepId: string) => void
}

interface StepProgress {
  id: string
  title: string
  completion: number
  status: 'not-started' | 'in-progress' | 'completed'
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [overallProgress, setOverallProgress] = useState(0)
  const [stepProgress, setStepProgress] = useState<StepProgress[]>([])
  const [metrics, setMetrics] = useState({
    totalRisks: 0,
    highRisks: 0,
    treatedRisks: 0,
    totalControls: 0,
    implementedControls: 0,
    openNCs: 0,
    completedTrainings: 0,
    upcomingAudits: 0
  })

  useEffect(() => {
    calculateProgress()
    calculateMetrics()

    // Listen for storage changes to auto-update
    const handleStorageChange = () => {
      calculateProgress()
      calculateMetrics()
    }

    window.addEventListener('storage', handleStorageChange)
    // Also listen for custom event for same-tab updates
    window.addEventListener('isms-data-updated', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('isms-data-updated', handleStorageChange)
    }
  }, [])

  const calculateProgress = () => {
    const steps: StepProgress[] = [
      { id: 'scope', title: 'Scope Definition', completion: calculateStepCompletion('scope'), status: 'not-started' },
      { id: 'policy', title: 'Security Policy', completion: calculateStepCompletion('policy'), status: 'not-started' },
      { id: 'risk-assessment', title: 'Risk Assessment', completion: calculateStepCompletion('risk-assessment'), status: 'not-started' },
      { id: 'risk-treatment', title: 'Risk Treatment', completion: calculateStepCompletion('risk-treatment'), status: 'not-started' },
      { id: 'soa', title: 'SOA', completion: calculateStepCompletion('soa'), status: 'not-started' },
      { id: 'treatment-plan', title: 'Treatment Plan', completion: calculateStepCompletion('treatment-plan'), status: 'not-started' },
      { id: 'objectives', title: 'Objectives', completion: calculateStepCompletion('objectives'), status: 'not-started' },
      { id: 'implementation', title: 'Implementation', completion: calculateStepCompletion('implementation'), status: 'not-started' },
      { id: 'training', title: 'Training', completion: calculateStepCompletion('training'), status: 'not-started' },
      { id: 'internal-audit', title: 'Internal Audit', completion: calculateStepCompletion('internal-audit'), status: 'not-started' },
      { id: 'management-review', title: 'Management Review', completion: calculateStepCompletion('management-review'), status: 'not-started' },
      { id: 'corrective-actions', title: 'Corrective Actions', completion: calculateStepCompletion('corrective-actions'), status: 'not-started' }
    ]

    steps.forEach(step => {
      if (step.completion === 100) step.status = 'completed'
      else if (step.completion > 0) step.status = 'in-progress'
    })

    const totalCompletion = steps.reduce((sum, step) => sum + step.completion, 0) / steps.length

    setStepProgress(steps)
    setOverallProgress(Math.round(totalCompletion))
  }

  const calculateStepCompletion = (stepId: string): number => {
    // Special handling for risk-treatment which doesn't use the standard key pattern
    if (stepId === 'risk-treatment') {
      const treatmentsData = localStorage.getItem('riskTreatments')
      if (!treatmentsData) return 0

      try {
        const treatments = JSON.parse(treatmentsData)
        const riskAssessmentData = localStorage.getItem('isms-risk-assessment')

        if (!riskAssessmentData) return 0

        const riskAssessment = JSON.parse(riskAssessmentData)
        const totalRisks = riskAssessment.risks?.length || 0

        if (totalRisks === 0) return 0

        // Get existing risk IDs to ensure we only count treatments for risks that exist
        const existingRiskIds = riskAssessment.risks?.map((r: any) => r.id) || []

        // Calculate percentage of risks that have been treated
        // Get unique risk IDs that still exist in risk assessment
        const uniqueRiskIds = new Set(
          treatments
            .map((t: any) => t.riskId)
            .filter((riskId: string) => existingRiskIds.includes(riskId))
        )
        const treatedRisks = uniqueRiskIds.size
        const treatmentPercentage = Math.round((treatedRisks / totalRisks) * 100)

        // Cap at 100% to avoid showing more than 100%
        return Math.min(treatmentPercentage, 100)
      } catch {
        return 0
      }
    }

    // Special handling for risk-assessment which uses 'isms-risk-assessment' instead of 'isms-risk-assessment-data'
    const storageKey = stepId === 'risk-assessment' ? 'isms-risk-assessment' : `isms-${stepId}-data`
    const data = localStorage.getItem(storageKey)
    if (!data) return 0

    try {
      const parsed = JSON.parse(data)

      // Calculate completion based on required fields
      switch (stepId) {
        case 'scope':
          // More comprehensive scope completion calculation
          let scopeCompletion = 0
          const totalChecks = 8

          // Check organization details (all required fields)
          if (parsed.organizationName && parsed.organizationName.trim() &&
              parsed.industry && parsed.industry.trim() &&
              parsed.ceoName && parsed.ceoName.trim() &&
              parsed.cisoName && parsed.cisoName.trim()) {
            scopeCompletion += 1
          }

          // Check internal issues (at least 1)
          if (parsed.internalIssues && parsed.internalIssues.length > 0) scopeCompletion += 1

          // Check external issues (at least 1)
          if (parsed.externalIssues && parsed.externalIssues.length > 0) scopeCompletion += 1

          // Check interested parties (at least 1)
          if (parsed.interestedParties && parsed.interestedParties.length > 0) scopeCompletion += 1

          // Check interfaces (at least 1)
          if (parsed.interfaces && parsed.interfaces.length > 0) scopeCompletion += 1

          // Check exclusions (at least 1)
          if (parsed.exclusions && parsed.exclusions.length > 0) scopeCompletion += 1

          // Check scope document (at least processes, departments, and locations)
          if (parsed.scopeDocument &&
              parsed.scopeDocument.processesAndServices?.length > 0 &&
              parsed.scopeDocument.departments?.length > 0 &&
              parsed.scopeDocument.physicalLocations?.length > 0) {
            scopeCompletion += 1
          }

          // Check if all data is complete (bonus point for completion)
          if (scopeCompletion === 7) scopeCompletion += 1

          return Math.round((scopeCompletion / totalChecks) * 100)
        case 'policy':
          // Comprehensive policy completion calculation
          let policyCompletion = 0
          const totalPolicyChecks = 6

          // Check organization name is filled
          if (parsed.organizationName && parsed.organizationName.trim()) {
            policyCompletion += 1
          }

          // Check policy statement is created
          if (parsed.policyStatement && parsed.policyStatement.trim()) {
            policyCompletion += 1
          }

          // Check at least one objective defined
          if (parsed.objectives && parsed.objectives.length > 0) {
            policyCompletion += 1
          }

          // Check at least one responsibility defined
          if (parsed.responsibilities && parsed.responsibilities.length > 0) {
            policyCompletion += 1
          }

          // Check at least one compliance requirement
          if (parsed.compliance && parsed.compliance.length > 0) {
            policyCompletion += 1
          }

          // Check consequences defined
          if (parsed.consequences && parsed.consequences.trim()) {
            policyCompletion += 1
          }

          return Math.round((policyCompletion / totalPolicyChecks) * 100)
        case 'risk-assessment':
          // Comprehensive risk assessment completion calculation
          let riskCompletion = 0
          const totalRiskChecks = 6

          // Check if organization name is filled
          if (parsed.organizationName && parsed.organizationName.trim()) {
            riskCompletion += 1
          }

          // Check if at least one asset is defined
          if (parsed.assets && parsed.assets.length > 0) {
            riskCompletion += 1
          }

          // Check if at least one threat is defined
          if (parsed.threats && parsed.threats.length > 0) {
            riskCompletion += 1
          }

          // Check if at least one vulnerability is defined
          if (parsed.vulnerabilities && parsed.vulnerabilities.length > 0) {
            riskCompletion += 1
          }

          // Check if at least one risk is identified
          if (parsed.risks && parsed.risks.length > 0) {
            riskCompletion += 1
          }

          // Check if risks have been assessed (have likelihood and impact)
          const assessedRisks = parsed.risks?.filter((r: any) =>
            r.likelihood && r.impact && r.riskLevel
          ).length || 0
          if (assessedRisks > 0) {
            riskCompletion += 1
          }

          return Math.round((riskCompletion / totalRiskChecks) * 100)
        case 'soa':
          // Special handling for SOA which uses 'statementOfApplicability' key
          const soaData = localStorage.getItem('statementOfApplicability')
          if (!soaData) return 0

          try {
            const soaControls = JSON.parse(soaData)
            const totalControls = soaControls.length

            if (totalControls === 0) return 0

            // Calculate completion based on controls that have been properly documented
            // A control is considered "documented" if it has:
            // 1. A status (applicable/not-applicable/partially-applicable)
            // 2. A justification explaining the decision
            // 3. For applicable controls: implementation details
            const documentedControls = soaControls.filter((ca: any) => {
              // Must have a justification
              const hasJustification = ca.justification && ca.justification.trim().length > 0
              if (!hasJustification) return false

              // For applicable/partially-applicable controls, check if implementation details exist
              if (ca.status === 'applicable' || ca.status === 'partially-applicable') {
                const hasImplementationInfo =
                  (ca.implementationStatus && ca.implementationStatus !== 'not-implemented') ||
                  (ca.implementationDescription && ca.implementationDescription.trim().length > 0) ||
                  (ca.responsibleParty && ca.responsibleParty.trim().length > 0)

                return hasImplementationInfo
              }

              // For not-applicable controls, just need justification (already checked above)
              return ca.status === 'not-applicable'
            })

            const completionPercentage = Math.round((documentedControls.length / totalControls) * 100)
            console.log(`SOA Completion: ${documentedControls.length}/${totalControls} = ${completionPercentage}%`)
            return completionPercentage
          } catch (error) {
            console.error('Error calculating SOA completion:', error)
            return 0
          }
        case 'treatment-plan':
          // Treatment plan completion based on having documented plans
          let treatmentPlanCompletion = 0
          const totalTreatmentChecks = 4

          // Check if organization name is filled
          if (parsed.organizationName && parsed.organizationName.trim()) {
            treatmentPlanCompletion += 1
          }

          // Check if treatment plans exist
          if (parsed.treatmentPlans && parsed.treatmentPlans.length > 0) {
            treatmentPlanCompletion += 1
          }

          // Check if implementation details are defined
          if (parsed.implementationDetails && parsed.implementationDetails.trim()) {
            treatmentPlanCompletion += 1
          }

          // Check if timelines are defined
          if (parsed.timelines && parsed.timelines.length > 0) {
            treatmentPlanCompletion += 1
          }

          return Math.round((treatmentPlanCompletion / totalTreatmentChecks) * 100)

        case 'objectives':
          // Objectives completion based on having defined and measurable objectives
          let objectivesCompletion = 0
          const totalObjectivesChecks = 3

          // Check if at least one objective exists
          if (parsed.objectives && parsed.objectives.length > 0) {
            objectivesCompletion += 1

            // Check if objectives have measurable targets
            const objectivesWithTargets = parsed.objectives.filter((obj: any) =>
              obj.target && obj.target.trim()
            ).length
            if (objectivesWithTargets > 0) {
              objectivesCompletion += 1
            }

            // Check if objectives have metrics/KPIs
            const objectivesWithMetrics = parsed.objectives.filter((obj: any) =>
              obj.metric && obj.metric.trim()
            ).length
            if (objectivesWithMetrics > 0) {
              objectivesCompletion += 1
            }
          }

          return Math.round((objectivesCompletion / totalObjectivesChecks) * 100)

        case 'implementation':
          // Implementation completion based on control implementation progress
          let implementationCompletion = 0
          const totalImplementationChecks = 3

          // Check if implementation records exist
          if (parsed.implementations && parsed.implementations.length > 0) {
            implementationCompletion += 1

            // Check if implementations have responsible parties
            const implementationsWithOwners = parsed.implementations.filter((impl: any) =>
              impl.responsibleParty && impl.responsibleParty.trim()
            ).length
            if (implementationsWithOwners > 0) {
              implementationCompletion += 1
            }

            // Check if implementations have completion dates
            const implementationsWithDates = parsed.implementations.filter((impl: any) =>
              impl.completionDate
            ).length
            if (implementationsWithDates > 0) {
              implementationCompletion += 1
            }
          }

          return Math.round((implementationCompletion / totalImplementationChecks) * 100)

        case 'training':
          // Training completion based on training sessions and attendance
          let trainingCompletion = 0
          const totalTrainingChecks = 4

          // Check if training sessions exist
          if (parsed.sessions && parsed.sessions.length > 0) {
            trainingCompletion += 1

            // Check if sessions have topics/content
            const sessionsWithContent = parsed.sessions.filter((s: any) =>
              s.topic && s.topic.trim()
            ).length
            if (sessionsWithContent > 0) {
              trainingCompletion += 1
            }

            // Check if sessions have attendance records
            const sessionsWithAttendance = parsed.sessions.filter((s: any) =>
              s.attendees && s.attendees.length > 0
            ).length
            if (sessionsWithAttendance > 0) {
              trainingCompletion += 1
            }

            // Check if any sessions are completed
            const completedSessions = parsed.sessions.filter((s: any) =>
              s.status === 'completed'
            ).length
            if (completedSessions > 0) {
              trainingCompletion += 1
            }
          }

          return Math.round((trainingCompletion / totalTrainingChecks) * 100)

        case 'internal-audit':
          // Internal audit completion based on audit planning and execution
          let auditCompletion = 0
          const totalAuditChecks = 5

          // Check if audit plans exist
          if (parsed.audits && parsed.audits.length > 0) {
            auditCompletion += 1

            // Check if audits have scope defined
            const auditsWithScope = parsed.audits.filter((a: any) =>
              a.scope && a.scope.trim()
            ).length
            if (auditsWithScope > 0) {
              auditCompletion += 1
            }

            // Check if audits have auditors assigned
            const auditsWithAuditors = parsed.audits.filter((a: any) =>
              a.auditor && a.auditor.trim()
            ).length
            if (auditsWithAuditors > 0) {
              auditCompletion += 1
            }

            // Check if audits have findings documented
            const auditsWithFindings = parsed.audits.filter((a: any) =>
              a.findings && a.findings.length > 0
            ).length
            if (auditsWithFindings > 0) {
              auditCompletion += 1
            }

            // Check if any audits are completed
            const completedAudits = parsed.audits.filter((a: any) =>
              a.status === 'completed'
            ).length
            if (completedAudits > 0) {
              auditCompletion += 1
            }
          }

          return Math.round((auditCompletion / totalAuditChecks) * 100)

        case 'management-review':
          // Management review completion based on review inputs and outputs
          let reviewCompletion = 0
          const totalReviewChecks = 5

          // Check if review inputs exist
          if (parsed.reviewInputs && parsed.reviewInputs.length > 0) {
            reviewCompletion += 1
          }

          // Check if review outputs/decisions exist
          if (parsed.reviewOutputs && parsed.reviewOutputs.length > 0) {
            reviewCompletion += 1
          }

          // Check if action items are defined
          if (parsed.actionItems && parsed.actionItems.length > 0) {
            reviewCompletion += 1
          }

          // Check if review date is set
          if (parsed.reviewDate) {
            reviewCompletion += 1
          }

          // Check if attendees are documented
          if (parsed.attendees && parsed.attendees.length > 0) {
            reviewCompletion += 1
          }

          return Math.round((reviewCompletion / totalReviewChecks) * 100)

        case 'corrective-actions':
          // Corrective actions completion based on NC management
          let correctiveCompletion = 0
          const totalCorrectiveChecks = 4

          // Check if non-conformities exist
          if (parsed.nonConformities && parsed.nonConformities.length > 0) {
            correctiveCompletion += 1

            // Check if NCs have root cause analysis
            const ncsWithRootCause = parsed.nonConformities.filter((nc: any) =>
              nc.rootCause && nc.rootCause.trim()
            ).length
            if (ncsWithRootCause > 0) {
              correctiveCompletion += 1
            }

            // Check if NCs have corrective actions defined
            const ncsWithActions = parsed.nonConformities.filter((nc: any) =>
              nc.correctiveAction && nc.correctiveAction.trim()
            ).length
            if (ncsWithActions > 0) {
              correctiveCompletion += 1
            }

            // Check if any NCs are closed
            const closedNCs = parsed.nonConformities.filter((nc: any) =>
              nc.status === 'closed'
            ).length
            if (closedNCs > 0) {
              correctiveCompletion += 1
            }
          }

          return Math.round((correctiveCompletion / totalCorrectiveChecks) * 100)

        default:
          return 0
      }
    } catch {
      return 0
    }
  }

  const calculateMetrics = () => {
    try {
      // Count risks - using correct storage key 'isms-risk-assessment'
      const riskData = localStorage.getItem('isms-risk-assessment')
      let totalRisks = 0
      let highRisks = 0
      let existingRiskIds: string[] = []

      if (riskData) {
        const parsed = JSON.parse(riskData)
        totalRisks = parsed.risks?.length || 0
        existingRiskIds = parsed.risks?.map((r: any) => r.id) || []
        highRisks = parsed.risks?.filter((r: any) =>
          r.riskLevel === 'high' || r.riskLevel === 'very-high'
        ).length || 0
      }

      // Count treated risks (unique risk IDs only, and only for risks that still exist)
      const treatmentsData = localStorage.getItem('riskTreatments')
      let treatedRisks = 0
      if (treatmentsData && totalRisks > 0) {
        const treatments = JSON.parse(treatmentsData)
        // Count unique risk IDs that still exist in the risk assessment
        const uniqueRiskIds = new Set(
          treatments
            .map((t: any) => t.riskId)
            .filter((riskId: string) => existingRiskIds.includes(riskId))
        )
        treatedRisks = uniqueRiskIds.size
      }

      // Count controls from SOA (Statement of Applicability)
      const soaData = localStorage.getItem('statementOfApplicability')
      let totalControls = 0
      let implementedControls = 0
      if (soaData) {
        const soaControls = JSON.parse(soaData)
        // Count only applicable and partially-applicable controls
        const applicableControls = soaControls.filter((ca: any) =>
          ca.status === 'applicable' || ca.status === 'partially-applicable'
        )
        totalControls = applicableControls.length
        implementedControls = applicableControls.filter((ca: any) =>
          ca.implementationStatus === 'implemented'
        ).length
      }

      // Count non-conformities
      const ncData = localStorage.getItem('isms-corrective-actions')
      let openNCs = 0
      if (ncData) {
        const parsed = JSON.parse(ncData)
        openNCs = parsed.nonConformities?.filter((nc: any) =>
          nc.status !== 'closed'
        ).length || 0
      }

      // Count training
      const trainingData = localStorage.getItem('isms-training-data')
      let completedTrainings = 0
      if (trainingData) {
        const parsed = JSON.parse(trainingData)
        completedTrainings = parsed.sessions?.filter((s: any) =>
          s.status === 'completed'
        ).length || 0
      }

      setMetrics({
        totalRisks,
        highRisks,
        treatedRisks,
        totalControls,
        implementedControls,
        openNCs,
        completedTrainings,
        upcomingAudits: 1 // Placeholder
      })
    } catch (error) {
      console.error('Error calculating metrics:', error)
    }
  }

  const getProgressColor = (completion: number) => {
    if (completion >= 80) return 'bg-emerald-500'
    if (completion >= 50) return 'bg-indigo-500'
    if (completion >= 20) return 'bg-amber-500'
    return 'bg-slate-300'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 text-xs rounded bg-emerald-100 text-emerald-700 font-medium">Completed</span>
      case 'in-progress':
        return <span className="px-2 py-0.5 text-xs rounded bg-indigo-100 text-indigo-700 font-medium">In Progress</span>
      default:
        return <span className="px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-600 font-medium">Not Started</span>
    }
  }

  const quickActions = [
    { id: 'risk-assessment', title: 'Continue Risk Assessment', icon: AlertTriangle, color: 'bg-amber-500' },
    { id: 'risk-treatment', title: 'Manage Risk Treatment', icon: Shield, color: 'bg-blue-600' },
    { id: 'soa', title: 'Review SOA Controls', icon: CheckCircle, color: 'bg-indigo-600' },
    { id: 'internal-audit', title: 'Plan Internal Audit', icon: Activity, color: 'bg-emerald-500' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto space-y-5 p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 mb-0.5">ISMS Dashboard</h1>
              <p className="text-slate-500 text-xs">ISO 27001:2022 Implementation Overview</p>
            </div>
            <div className="text-right bg-gradient-to-br from-indigo-600 to-indigo-700 px-16 py-8 rounded-2xl shadow-sm">
              <div className="text-base text-indigo-100 font-medium uppercase tracking-wide">Last Updated</div>
              <div className="text-lg font-bold text-white mt-3">{new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* Overall Progress Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl shadow-sm p-8 text-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Progress</h2>
              <p className="text-indigo-100 text-sm">ISMS Implementation Status</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-7 py-4">
              <div className="text-5xl font-bold">{overallProgress}%</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3.5 mb-8">
            <div
              className="bg-white rounded-full h-3.5 transition-all duration-1000 shadow-lg"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
              <div className="text-xs text-indigo-100 font-medium mb-3 uppercase tracking-wide">Completed</div>
              <div className="text-2xl font-bold">
                {stepProgress.filter(s => s.status === 'completed').length} / {stepProgress.length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
              <div className="text-xs text-indigo-100 font-medium mb-3 uppercase tracking-wide">In Progress</div>
              <div className="text-2xl font-bold">
                {stepProgress.filter(s => s.status === 'in-progress').length}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
              <div className="text-xs text-indigo-100 font-medium mb-3 uppercase tracking-wide">Ready</div>
              <div className="text-2xl font-bold">
                {overallProgress >= 90 ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Risks</div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-3">{metrics.totalRisks}</div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-amber-600 font-medium">{metrics.highRisks} High/Critical</span>
              <span className="text-green-600 font-medium">{metrics.treatedRisks} Treated</span>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Controls</div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-3">{metrics.implementedControls}/{metrics.totalControls}</div>
            <div className="text-xs text-indigo-600 font-medium">
              {metrics.totalControls > 0 ? Math.round((metrics.implementedControls / metrics.totalControls) * 100) : 0}% Complete
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-rose-600" />
              </div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Open NCs</div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-3">{metrics.openNCs}</div>
            <div className="text-xs text-rose-600 font-medium">
              Requires Attention
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200/60 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Training</div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-3">{metrics.completedTrainings}</div>
            <div className="text-xs text-emerald-600 font-medium">
              Sessions Completed
            </div>
          </div>
        </div>

        {/* Analytics & Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Steps Progress Chart */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Implementation Progress by Step</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stepProgress} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="title"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fontSize: 10 }}
                  stroke="#64748b"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  stroke="#64748b"
                  label={{ value: 'Completion %', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
                  {stepProgress.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.completion >= 80 ? '#10b981' :
                        entry.completion >= 50 ? '#6366f1' :
                        entry.completion >= 20 ? '#f59e0b' :
                        '#cbd5e1'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution Chart */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: stepProgress.filter(s => s.status === 'completed').length, color: '#10b981' },
                    { name: 'In Progress', value: stepProgress.filter(s => s.status === 'in-progress').length, color: '#6366f1' },
                    { name: 'Not Started', value: stepProgress.filter(s => s.status === 'not-started').length, color: '#cbd5e1' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={85}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {[
                    { name: 'Completed', value: stepProgress.filter(s => s.status === 'completed').length, color: '#10b981' },
                    { name: 'In Progress', value: stepProgress.filter(s => s.status === 'in-progress').length, color: '#6366f1' },
                    { name: 'Not Started', value: stepProgress.filter(s => s.status === 'not-started').length, color: '#cbd5e1' }
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-slate-900">Completed</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {stepProgress.filter(s => s.status === 'completed').length} ({((stepProgress.filter(s => s.status === 'completed').length / stepProgress.length) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-indigo-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                  <span className="text-sm font-medium text-slate-900">In Progress</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {stepProgress.filter(s => s.status === 'in-progress').length} ({((stepProgress.filter(s => s.status === 'in-progress').length / stepProgress.length) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <span className="text-sm font-medium text-slate-900">Not Started</span>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {stepProgress.filter(s => s.status === 'not-started').length} ({((stepProgress.filter(s => s.status === 'not-started').length / stepProgress.length) * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Risk Distribution Chart */}
          {metrics.totalRisks > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Risk Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'High/Critical', value: metrics.highRisks, color: '#dc2626' },
                      { name: 'Medium/Low', value: metrics.totalRisks - metrics.highRisks, color: '#f59e0b' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'High/Critical', value: metrics.highRisks, color: '#dc2626' },
                      { name: 'Medium/Low', value: metrics.totalRisks - metrics.highRisks, color: '#f59e0b' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Controls Implementation Chart */}
          {metrics.totalControls > 0 && (
            <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Controls Implementation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Implemented', value: metrics.implementedControls, color: '#10b981' },
                      { name: 'Pending', value: metrics.totalControls - metrics.implementedControls, color: '#94a3b8' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Implemented', value: metrics.implementedControls, color: '#10b981' },
                      { name: 'Pending', value: metrics.totalControls - metrics.implementedControls, color: '#94a3b8' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  onClick={() => onNavigate(action.id)}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left hover:border-slate-300"
                >
                  <div className={`w-9 h-9 rounded-lg ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs font-medium text-slate-900">
                    {action.title}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step Progress Details */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Implementation Steps</h3>
          <div className="space-y-2.5">
            {stepProgress.map(step => (
              <div
                key={step.id}
                onClick={() => onNavigate(step.id)}
                className="p-3.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-slate-900 text-xs">
                      {step.title}
                    </span>
                    {getStatusBadge(step.status)}
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{step.completion}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className={`${getProgressColor(step.completion)} rounded-full h-1.5 transition-all duration-500`}
                    style={{ width: `${step.completion}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Activities */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-5 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">Upcoming Activities</h3>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 p-3.5 bg-indigo-50 rounded-lg border border-indigo-200/60">
              <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                <div className="text-center">
                  <div className="text-xs leading-tight">Next</div>
                  <div className="text-base font-bold leading-tight">Week</div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-xs mb-0.5">Internal Audit Scheduled</div>
                <div className="text-xs text-slate-600">Review all implemented controls</div>
              </div>
              <button
                onClick={() => onNavigate('internal-audit')}
                className="px-3.5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors flex-shrink-0"
              >
                View
              </button>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-lg border border-slate-200">
              <div className="w-12 h-12 rounded-lg bg-slate-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                <div className="text-center">
                  <div className="text-xs leading-tight">In</div>
                  <div className="text-base font-bold leading-tight">30d</div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 text-xs mb-0.5">Management Review Due</div>
                <div className="text-xs text-slate-600">Quarterly ISMS performance review</div>
              </div>
              <button
                onClick={() => onNavigate('management-review')}
                className="px-3.5 py-2 bg-slate-600 text-white rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors flex-shrink-0"
              >
                Prepare
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
