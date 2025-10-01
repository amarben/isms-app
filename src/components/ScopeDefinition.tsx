import React, { useState } from 'react'
import { ChevronRight, ChevronLeft, Save, FileText, Building, Users, Shield, ExternalLink, Plus, Check, Loader2, Download, Copy, FileDown } from 'lucide-react'

interface ScopeData {
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

const initialScopeData: ScopeData = {
  internalIssues: [],
  externalIssues: [],
  interestedParties: [],
  interfaces: [],
  exclusions: [],
  scopeDocument: {
    processesAndServices: [],
    departments: [],
    physicalLocations: [],
    additionalNotes: ''
  }
}

const predefinedInternalIssues = [
  'Sensitive R&D data requires high protection',
  'Financial data processing and reporting',
  'Employee personal information handling',
  'Intellectual property and trade secrets',
  'Customer data and privacy requirements',
  'Regulatory compliance obligations',
  'Critical business processes and operations',
  'IT infrastructure and system vulnerabilities',
  'Third-party vendor access and dependencies',
  'Remote work and mobile device usage',
  'Data backup and disaster recovery needs',
  'Business continuity requirements'
]

const predefinedExternalIssues = [
  'Industry regulations (GDPR, HIPAA, SOX, etc.)',
  'Cybersecurity threats and attack vectors',
  'Competitive market pressures',
  'Customer security requirements',
  'Partner and vendor security standards',
  'Insurance and legal obligations',
  'Technology changes and obsolescence',
  'Supply chain security risks',
  'Economic and political instability',
  'Natural disasters and environmental factors',
  'International standards compliance (ISO 27001)',
  'Government and regulatory changes'
]

const predefinedInterestedParties = [
  {
    party: 'Customers',
    requirements: 'Data protection and privacy compliance',
    influence: 'Customer data and payment information must be included in scope'
  },
  {
    party: 'Employees',
    requirements: 'Personal data protection and workplace security',
    influence: 'HR systems and employee data handling must be covered'
  },
  {
    party: 'Regulatory Bodies (GDPR/DPA)',
    requirements: 'Compliance with data protection regulations',
    influence: 'All personal data processing activities must be in scope'
  },
  {
    party: 'Shareholders/Investors',
    requirements: 'Financial data security and business continuity',
    influence: 'Financial systems and reporting processes must be included'
  },
  {
    party: 'Business Partners',
    requirements: 'Secure data sharing and communication',
    influence: 'Partner integration systems and shared data must be covered'
  },
  {
    party: 'Suppliers/Vendors',
    requirements: 'Supply chain security and vendor management',
    influence: 'Vendor access systems and procurement data must be in scope'
  },
  {
    party: 'Government/Tax Authorities',
    requirements: 'Regulatory compliance and tax reporting',
    influence: 'Government reporting systems and tax data must be included'
  },
  {
    party: 'Insurance Companies',
    requirements: 'Risk management and security controls',
    influence: 'Critical business systems for insurance coverage must be in scope'
  },
  {
    party: 'Industry Regulators',
    requirements: 'Sector-specific compliance requirements',
    influence: 'Industry-specific systems and data must be covered'
  },
  {
    party: 'Auditors',
    requirements: 'Audit trail and compliance evidence',
    influence: 'Audit and compliance systems must be accessible and in scope'
  },
  {
    party: 'Legal/Compliance Teams',
    requirements: 'Legal compliance and risk management',
    influence: 'Legal document systems and compliance data must be included'
  },
  {
    party: 'IT Security Teams',
    requirements: 'Security monitoring and incident response',
    influence: 'All IT infrastructure and security systems must be in scope'
  }
]

const predefinedProcessesAndServices = [
  'Customer data processing',
  'Financial reporting and accounting',
  'Email and communication services',
  'Human resources management',
  'Payroll processing',
  'Customer relationship management (CRM)',
  'Enterprise resource planning (ERP)',
  'Data backup and recovery',
  'Network and infrastructure management',
  'Software development and deployment',
  'Quality assurance and testing',
  'Business intelligence and analytics',
  'Document management systems',
  'Access control and authentication',
  'Incident response and management',
  'Vendor and supplier management',
  'Compliance monitoring and reporting',
  'Risk management processes',
  'Asset management',
  'Change management',
  'Business continuity planning',
  'Training and awareness programs'
]

const predefinedDepartments = [
  'IT Department',
  'Finance Department',
  'Human Resources',
  'Research & Development (R&D)',
  'Sales and Marketing',
  'Customer Service',
  'Operations',
  'Legal and Compliance',
  'Executive Management',
  'Quality Assurance',
  'Procurement',
  'Security Team',
  'Accounting',
  'Business Development',
  'Product Management',
  'Engineering',
  'Support Services',
  'Administration',
  'Risk Management',
  'Internal Audit'
]

const predefinedPhysicalLocations = [
  'Main office building',
  'Data center facility',
  'Secondary office location',
  'Branch office in [City]',
  'Remote work locations',
  'Cloud infrastructure (AWS/Azure/GCP)',
  'Disaster recovery site',
  'Shared office spaces',
  'Warehouse and storage facilities',
  'Manufacturing facilities',
  'Customer service centers',
  'Regional headquarters',
  'Development centers',
  'Training facilities',
  'Third-party hosted facilities',
  'Mobile offices and vehicles',
  'Temporary project sites',
  'Partner co-location facilities'
]

const predefinedScopeExclusions = [
  {
    item: 'Personal employee devices (BYOD)',
    justification: 'Company has no administrative control over personal devices used by employees'
  },
  {
    item: 'Legacy systems scheduled for retirement',
    justification: 'Systems are being decommissioned within 6 months and contain no sensitive data'
  },
  {
    item: 'Non-business personal data',
    justification: 'Personal employee information not related to business operations is outside scope'
  },
  {
    item: 'Third-party managed cloud services',
    justification: 'Services fully managed by external providers with their own security controls'
  },
  {
    item: 'Guest Wi-Fi networks',
    justification: 'Isolated network with no access to business systems or data'
  },
  {
    item: 'Physical security systems (building management)',
    justification: 'Managed and controlled by building owner/property management company'
  },
  {
    item: 'Personal social media accounts',
    justification: 'Not under company control and not used for business purposes'
  },
  {
    item: 'Personal email accounts',
    justification: 'Company has no control over employees\' personal email services'
  },
  {
    item: 'Recreational facilities (cafeteria, gym, break rooms)',
    justification: 'No business information assets or processing activities in these areas'
  },
  {
    item: 'Personal vehicles in company parking',
    justification: 'Vehicles are personal property outside company administrative control'
  },
  {
    item: 'Contractor-owned equipment and devices',
    justification: 'Equipment owned and managed by third-party contractors under separate agreements'
  },
  {
    item: 'Public areas of shared office buildings',
    justification: 'Common areas managed by building owner with no business activities'
  },
  {
    item: 'Development and testing environments (sandbox)',
    justification: 'Contains no production data and is isolated from business operations'
  },
  {
    item: 'Archived systems with no network connectivity',
    justification: 'Offline archived systems with no active access or business processes'
  },
  {
    item: 'Personal cloud storage accounts (Dropbox, Google Drive)',
    justification: 'Personal accounts not managed by company IT and prohibited for business use'
  },
  {
    item: 'Emergency communication systems (fire alarms, PA)',
    justification: 'Managed by emergency services and building management, not company systems'
  },
  {
    item: 'Utility infrastructure (power, water, HVAC)',
    justification: 'Managed by utility providers and building management, outside IT scope'
  },
  {
    item: 'Public marketing websites (no sensitive data)',
    justification: 'Public-facing marketing content with no confidential business information'
  },
  {
    item: 'Vendor demonstration equipment',
    justification: 'Temporary equipment owned and managed by vendors for evaluation purposes'
  },
  {
    item: 'Mobile devices without business data access',
    justification: 'Personal mobile devices with no access to company systems or data'
  }
]

const ScopeDefinition: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [scopeData, setScopeData] = useState<ScopeData>(initialScopeData)
  const [customInternalIssue, setCustomInternalIssue] = useState('')
  const [customExternalIssue, setCustomExternalIssue] = useState('')
  const [customProcess, setCustomProcess] = useState('')
  const [customDepartment, setCustomDepartment] = useState('')
  const [customLocation, setCustomLocation] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const steps = [
    {
      title: 'Internal & External Issues',
      description: 'Identify issues that define areas for ISMS scope',
      icon: Building
    },
    {
      title: 'Interested Parties',
      description: 'Determine parties that can influence the scope',
      icon: Users
    },
    {
      title: 'Interfaces & Dependencies',
      description: 'Consider system interfaces and dependencies',
      icon: Shield
    },
    {
      title: 'Exclusions',
      description: 'Define what is excluded from the scope',
      icon: ExternalLink
    },
    {
      title: 'Scope Document',
      description: 'Write the final ISMS scope document',
      icon: FileText
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addPredefinedInternalIssue = (issue: string) => {
    if (!scopeData.internalIssues.includes(issue)) {
      setScopeData(prev => ({
        ...prev,
        internalIssues: [...prev.internalIssues, issue]
      }))
    }
  }

  const addCustomInternalIssue = () => {
    if (customInternalIssue.trim() && !scopeData.internalIssues.includes(customInternalIssue.trim())) {
      setScopeData(prev => ({
        ...prev,
        internalIssues: [...prev.internalIssues, customInternalIssue.trim()]
      }))
      setCustomInternalIssue('')
    }
  }

  const removeInternalIssue = (index: number) => {
    setScopeData(prev => ({
      ...prev,
      internalIssues: prev.internalIssues.filter((_, i) => i !== index)
    }))
  }

  const addPredefinedExternalIssue = (issue: string) => {
    if (!scopeData.externalIssues.includes(issue)) {
      setScopeData(prev => ({
        ...prev,
        externalIssues: [...prev.externalIssues, issue]
      }))
    }
  }

  const addCustomExternalIssue = () => {
    if (customExternalIssue.trim() && !scopeData.externalIssues.includes(customExternalIssue.trim())) {
      setScopeData(prev => ({
        ...prev,
        externalIssues: [...prev.externalIssues, customExternalIssue.trim()]
      }))
      setCustomExternalIssue('')
    }
  }

  const removeExternalIssue = (index: number) => {
    setScopeData(prev => ({
      ...prev,
      externalIssues: prev.externalIssues.filter((_, i) => i !== index)
    }))
  }

  const addPredefinedInterestedParty = (partyData: typeof predefinedInterestedParties[0]) => {
    const exists = scopeData.interestedParties.some(p => p.party === partyData.party)
    if (!exists) {
      setScopeData(prev => ({
        ...prev,
        interestedParties: [...prev.interestedParties, partyData]
      }))
    }
  }

  const addCustomInterestedParty = () => {
    setScopeData(prev => ({
      ...prev,
      interestedParties: [...prev.interestedParties, { party: '', requirements: '', influence: '' }]
    }))
  }

  const updateInterestedParty = (index: number, field: string, value: string) => {
    setScopeData(prev => ({
      ...prev,
      interestedParties: prev.interestedParties.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeInterestedParty = (index: number) => {
    setScopeData(prev => ({
      ...prev,
      interestedParties: prev.interestedParties.filter((_, i) => i !== index)
    }))
  }

  const addInterface = () => {
    setScopeData(prev => ({
      ...prev,
      interfaces: [...prev.interfaces, { system: '', dependency: '', impact: '' }]
    }))
  }

  const updateInterface = (index: number, field: string, value: string) => {
    setScopeData(prev => ({
      ...prev,
      interfaces: prev.interfaces.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeInterface = (index: number) => {
    setScopeData(prev => ({
      ...prev,
      interfaces: prev.interfaces.filter((_, i) => i !== index)
    }))
  }

  const addPredefinedExclusion = (exclusionData: typeof predefinedScopeExclusions[0]) => {
    const exists = scopeData.exclusions.some(e => e.item === exclusionData.item)
    if (!exists) {
      setScopeData(prev => ({
        ...prev,
        exclusions: [...prev.exclusions, exclusionData]
      }))
    }
  }

  const addExclusion = () => {
    setScopeData(prev => ({
      ...prev,
      exclusions: [...prev.exclusions, { item: '', justification: '' }]
    }))
  }

  const updateExclusion = (index: number, field: string, value: string) => {
    setScopeData(prev => ({
      ...prev,
      exclusions: prev.exclusions.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeExclusion = (index: number) => {
    setScopeData(prev => ({
      ...prev,
      exclusions: prev.exclusions.filter((_, i) => i !== index)
    }))
  }

  // Scope Document Management Functions
  const addPredefinedProcess = (process: string) => {
    if (!scopeData.scopeDocument.processesAndServices.includes(process)) {
      setScopeData(prev => ({
        ...prev,
        scopeDocument: {
          ...prev.scopeDocument,
          processesAndServices: [...prev.scopeDocument.processesAndServices, process]
        }
      }))
    }
  }

  const addProcessOrService = () => {
    if (customProcess.trim() && !scopeData.scopeDocument.processesAndServices.includes(customProcess.trim())) {
      setScopeData(prev => ({
        ...prev,
        scopeDocument: {
          ...prev.scopeDocument,
          processesAndServices: [...prev.scopeDocument.processesAndServices, customProcess.trim()]
        }
      }))
      setCustomProcess('')
    }
  }

  const removeProcessOrService = (index: number) => {
    setScopeData(prev => ({
      ...prev,
      scopeDocument: {
        ...prev.scopeDocument,
        processesAndServices: prev.scopeDocument.processesAndServices.filter((_, i) => i !== index)
      }
    }))
  }

  const addPredefinedDepartment = (department: string) => {
    if (!scopeData.scopeDocument.departments.includes(department)) {
      setScopeData(prev => ({
        ...prev,
        scopeDocument: {
          ...prev.scopeDocument,
          departments: [...prev.scopeDocument.departments, department]
        }
      }))
    }
  }

  const addDepartment = () => {
    if (customDepartment.trim() && !scopeData.scopeDocument.departments.includes(customDepartment.trim())) {
      setScopeData(prev => ({
        ...prev,
        scopeDocument: {
          ...prev.scopeDocument,
          departments: [...prev.scopeDocument.departments, customDepartment.trim()]
        }
      }))
      setCustomDepartment('')
    }
  }

  const removeDepartment = (index: number) => {
    setScopeData(prev => ({
      ...prev,
      scopeDocument: {
        ...prev.scopeDocument,
        departments: prev.scopeDocument.departments.filter((_, i) => i !== index)
      }
    }))
  }

  const addPredefinedLocation = (location: string) => {
    if (!scopeData.scopeDocument.physicalLocations.includes(location)) {
      setScopeData(prev => ({
        ...prev,
        scopeDocument: {
          ...prev.scopeDocument,
          physicalLocations: [...prev.scopeDocument.physicalLocations, location]
        }
      }))
    }
  }

  const addPhysicalLocation = () => {
    if (customLocation.trim() && !scopeData.scopeDocument.physicalLocations.includes(customLocation.trim())) {
      setScopeData(prev => ({
        ...prev,
        scopeDocument: {
          ...prev.scopeDocument,
          physicalLocations: [...prev.scopeDocument.physicalLocations, customLocation.trim()]
        }
      }))
      setCustomLocation('')
    }
  }

  const removePhysicalLocation = (index: number) => {
    setScopeData(prev => ({
      ...prev,
      scopeDocument: {
        ...prev.scopeDocument,
        physicalLocations: prev.scopeDocument.physicalLocations.filter((_, i) => i !== index)
      }
    }))
  }


  const generateScopeDocument = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      // Prepare the data for the API
      const payload = {
        internalIssues: scopeData.internalIssues,
        externalIssues: scopeData.externalIssues,
        interestedParties: scopeData.interestedParties,
        interfaces: scopeData.interfaces,
        exclusions: scopeData.exclusions,
        scopeDocument: scopeData.scopeDocument
      }

      // Create the prompt for DeepSeek
      const prompt = `
You are an expert ISO 27001 consultant. Generate a comprehensive, professional ISMS Scope Document using ALL the provided data. This must be a customized document, not a generic template.

## CRITICAL REQUIREMENTS:
1. Use ALL processes, departments, and locations provided - do not select only a few
2. Include ALL exclusions with their specific justifications
3. Reference ALL internal/external issues and interested parties
4. Create a realistic organization name (not placeholders like [Organization Name])
5. Use current date and realistic details
6. Make it audit-ready and professional

## Analysis Data:

### Internal Issues Identified (USE ALL):
${scopeData.internalIssues.map(issue => `- ${issue}`).join('\n')}

### External Issues Identified (USE ALL):
${scopeData.externalIssues.map(issue => `- ${issue}`).join('\n')}

### Interested Parties (REFERENCE ALL):
${scopeData.interestedParties.map(party => `
- **${party.party}**
  - Requirements: ${party.requirements}
  - Influence on Scope: ${party.influence}
`).join('\n')}

### System Interfaces & Dependencies:
${scopeData.interfaces.map(interface_ => `
- **${interface_.system}**
  - Dependency: ${interface_.dependency}
  - Impact on Scope: ${interface_.impact}
`).join('\n')}

### Scope Components - INCLUDE ALL ITEMS:

**ALL Processes and Services (${scopeData.scopeDocument.processesAndServices.length} total):**
${scopeData.scopeDocument.processesAndServices.map(item => `- ${item}`).join('\n')}

**ALL Departments/Units (${scopeData.scopeDocument.departments.length} total):**
${scopeData.scopeDocument.departments.map(item => `- ${item}`).join('\n')}

**ALL Physical Locations (${scopeData.scopeDocument.physicalLocations.length} total):**
${scopeData.scopeDocument.physicalLocations.map(item => `- ${item}`).join('\n')}

**ALL Exclusions with Justifications (${scopeData.exclusions.length} total):**
${scopeData.exclusions.map(exclusion => `
- **${exclusion.item}**
  - Justification: ${exclusion.justification}
`).join('\n')}

**Additional Context:**
${scopeData.scopeDocument.additionalNotes || 'No additional notes provided'}

## Document Structure Required:

1. **Document Header** - Include realistic org name, version, current date
2. **Executive Summary** - Summarize key scope decisions based on the analysis
3. **Scope Statement** - Clear, comprehensive scope definition
4. **Organizational Context** - How internal/external issues shaped the scope
5. **Interested Parties Impact** - How their requirements influenced boundaries
6. **Scope Boundaries** - List ALL processes, departments, locations with proper categorization
7. **Exclusions** - List ALL exclusions with justifications (not "no exclusions")
8. **Interfaces & Dependencies** - Address system dependencies and their scope impact
9. **Review Information** - Approval section with realistic roles

## Output Requirements:
- Use actual data, not placeholders
- Professional ISO 27001 language
- Complete coverage of all provided information
- Audit-ready quality
- Proper markdown formatting
- No generic template language

Generate the complete document now using ALL the provided analysis data.
`

      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: 'You are an expert ISO 27001 consultant and technical writer. Create comprehensive, customized ISMS documentation using ALL provided data. Never use generic placeholders or templates. Generate audit-ready documents that demonstrate thorough analysis and professional quality.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 6000,
          temperature: 0.2
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.choices && data.choices[0] && data.choices[0].message) {
        setGeneratedDocument(data.choices[0].message.content)
      } else {
        throw new Error('Invalid response format from API')
      }
    } catch (err) {
      console.error('Error generating document:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate document')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (generatedDocument) {
      try {
        await navigator.clipboard.writeText(generatedDocument)
        alert('Document copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy:', err)
        alert('Failed to copy document to clipboard')
      }
    }
  }

  const downloadDocument = () => {
    if (generatedDocument) {
      const blob = new Blob([generatedDocument], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ISMS_Scope_Document.md'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const downloadDocx = async () => {
    if (!generatedDocument) return

    try {
      console.log('Starting DOCX generation...')

      // Import the docx library dynamically
      const docxLib = await import('docx')
      console.log('DOCX library imported successfully')

      const {
        Document,
        Packer,
        Paragraph,
        HeadingLevel,
        TextRun,
        Table,
        TableRow,
        TableCell,
        WidthType,
        AlignmentType,
        BorderStyle,
        UnderlineType
      } = docxLib

      // Parse the markdown content into structured elements
      const docElements = parseAdvancedMarkdownToDocx(generatedDocument, docxLib)

      console.log(`Created ${docElements.length} document elements`)

      // Create the document with professional styling
      const doc = new Document({
        creator: "ISMS Scope Generator",
        title: "ISMS Scope Document",
        description: "ISO 27001 Information Security Management System Scope Document",
        sections: [{
          properties: {
            page: {
              margin: {
                top: 720,  // 0.5 inch
                right: 720,
                bottom: 720,
                left: 720
              }
            }
          },
          children: docElements
        }]
      })

      console.log('Document created, generating blob...')

      // Generate the DOCX blob
      const buffer = await Packer.toBlob(doc)

      console.log('Blob generated successfully, size:', buffer.size)

      // Create download link
      const url = URL.createObjectURL(buffer)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ISMS_Scope_Document.docx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log('Download initiated successfully')

    } catch (error) {
      console.error('Detailed error generating DOCX:', error)
      console.error('Error stack:', error.stack)
      alert(`Failed to generate DOCX file: ${error.message}. Please try downloading as Markdown instead.`)
    }
  }

  const parseAdvancedMarkdownToDocx = (markdown: string, docxLib: any): any[] => {
    const {
      Paragraph,
      HeadingLevel,
      TextRun,
      Table,
      TableRow,
      TableCell,
      WidthType,
      AlignmentType,
      BorderStyle,
      UnderlineType
    } = docxLib

    const lines = markdown.split('\n')
    const elements: any[] = []
    let isInTable = false
    let tableRows: any[] = []

    const parseInlineFormatting = (text: string): TextRun[] => {
      const runs: TextRun[] = []
      let currentText = text

      // Handle bold text (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g
      let lastIndex = 0
      let match

      while ((match = boldRegex.exec(text)) !== null) {
        // Add text before bold
        if (match.index > lastIndex) {
          const beforeText = text.substring(lastIndex, match.index)
          if (beforeText) {
            runs.push(new TextRun({ text: beforeText }))
          }
        }
        // Add bold text
        runs.push(new TextRun({ text: match[1], bold: true }))
        lastIndex = match.index + match[0].length
      }

      // Add remaining text
      if (lastIndex < text.length) {
        const remainingText = text.substring(lastIndex)
        if (remainingText) {
          runs.push(new TextRun({ text: remainingText }))
        }
      }

      // If no formatting found, return simple text run
      if (runs.length === 0) {
        runs.push(new TextRun({ text: text }))
      }

      return runs
    }

    const finishTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          new Table({
            rows: tableRows,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
            }
          })
        )
        tableRows = []
        isInTable = false
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      if (line === '') {
        // Finish table if we were in one
        if (isInTable) {
          finishTable()
        }
        // Add spacing paragraph
        elements.push(
          new Paragraph({
            text: '',
            spacing: { before: 120, after: 120 }
          })
        )
        continue
      }

      if (line.startsWith('# ')) {
        if (isInTable) finishTable()
        // H1 heading with professional styling
        elements.push(
          new Paragraph({
            children: parseInlineFormatting(line.substring(2)),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            alignment: AlignmentType.CENTER
          })
        )
      } else if (line.startsWith('## ')) {
        if (isInTable) finishTable()
        // H2 heading
        elements.push(
          new Paragraph({
            children: parseInlineFormatting(line.substring(3)),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        )
      } else if (line.startsWith('### ')) {
        if (isInTable) finishTable()
        // H3 heading
        elements.push(
          new Paragraph({
            children: parseInlineFormatting(line.substring(4)),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 120 }
          })
        )
      } else if (line.startsWith('* ') || line.startsWith('- ')) {
        if (isInTable) finishTable()
        // List item with proper bullet formatting
        elements.push(
          new Paragraph({
            children: parseInlineFormatting(line.substring(2)),
            bullet: { level: 0 },
            spacing: { before: 60, after: 60 },
            indent: { left: 360 }
          })
        )
      } else if (line.includes('|') && line.split('|').length > 2) {
        // Table row
        const cells = line.split('|').filter(cell => cell.trim() !== '')

        if (cells.length > 0) {
          const isHeaderRow = i === 0 || (i > 0 && !lines[i-1].includes('|'))

          const tableCells = cells.map(cellText =>
            new TableCell({
              children: [
                new Paragraph({
                  children: parseInlineFormatting(cellText.trim()),
                  alignment: AlignmentType.LEFT,
                  spacing: { before: 100, after: 100 }
                })
              ],
              shading: isHeaderRow ? { fill: "f2f2f2" } : undefined,
              width: {
                size: Math.floor(100 / cells.length),
                type: WidthType.PERCENTAGE
              }
            })
          )

          tableRows.push(new TableRow({ children: tableCells }))
          isInTable = true
        }
      } else if (line.trim() === '---' || line.trim() === '***') {
        if (isInTable) finishTable()
        // Page break or section divider
        elements.push(
          new Paragraph({
            text: '',
            spacing: { before: 400, after: 400 },
            border: {
              bottom: {
                color: "cccccc",
                space: 8,
                style: BorderStyle.SINGLE,
                size: 6
              }
            }
          })
        )
      } else {
        if (isInTable) finishTable()
        // Regular paragraph with inline formatting
        if (line.trim() !== '') {
          elements.push(
            new Paragraph({
              children: parseInlineFormatting(line),
              spacing: { before: 100, after: 100 },
              alignment: AlignmentType.JUSTIFY
            })
          )
        }
      }
    }

    // Finish any remaining table
    if (isInTable) {
      finishTable()
    }

    return elements
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">How to define an ISO 27001 ISMS scope step by step</h4>
              <p className="text-blue-800 text-sm mb-3">
                Determining the scope boundaries is a critical step in the process of successfully implementing and operating an ISMS according to ISO 27001:2022.
              </p>
              <p className="text-blue-800 text-sm">
                <strong>Step 1:</strong> Research which internal or external issues define the areas that should be in the scope – e.g., the most sensitive information is in the company's R&D department.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Internal Issues</h3>

              {/* Predefined Issues */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common internal issues:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {predefinedInternalIssues.map((issue, index) => {
                    const isSelected = scopeData.internalIssues.includes(issue)
                    return (
                      <button
                        key={index}
                        onClick={() => addPredefinedInternalIssue(issue)}
                        disabled={isSelected}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{issue}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Issue Input */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom internal issue:</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInternalIssue}
                    onChange={(e) => setCustomInternalIssue(e.target.value)}
                    placeholder="Enter your custom internal issue..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomInternalIssue()}
                  />
                  <button
                    onClick={addCustomInternalIssue}
                    disabled={!customInternalIssue.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Issues */}
              {scopeData.internalIssues.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected internal issues:</h4>
                  <div className="space-y-2">
                    {scopeData.internalIssues.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-800 text-sm">{issue}</span>
                        <button
                          onClick={() => removeInternalIssue(index)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">External Issues</h3>

              {/* Predefined Issues */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common external issues:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {predefinedExternalIssues.map((issue, index) => {
                    const isSelected = scopeData.externalIssues.includes(issue)
                    return (
                      <button
                        key={index}
                        onClick={() => addPredefinedExternalIssue(issue)}
                        disabled={isSelected}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{issue}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Issue Input */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom external issue:</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customExternalIssue}
                    onChange={(e) => setCustomExternalIssue(e.target.value)}
                    placeholder="Enter your custom external issue..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addCustomExternalIssue()}
                  />
                  <button
                    onClick={addCustomExternalIssue}
                    disabled={!customExternalIssue.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Issues */}
              {scopeData.externalIssues.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected external issues:</h4>
                  <div className="space-y-2">
                    {scopeData.externalIssues.map((issue, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-800 text-sm">{issue}</span>
                        <button
                          onClick={() => removeExternalIssue(index)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Step 2: Interested Parties Analysis</h4>
              <p className="text-blue-800 text-sm">
                <strong>Step 2:</strong> Determine whether any interested parties can influence the scope – e.g., the EU GDPR requires personal data to be included in the scope.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Interested Parties</h3>

              {/* Predefined Interested Parties */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common interested parties:</h4>
                <div className="space-y-3">
                  {predefinedInterestedParties.map((partyData, index) => {
                    const isSelected = scopeData.interestedParties.some(p => p.party === partyData.party)
                    return (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-green-50 border-green-200 cursor-not-allowed'
                            : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        onClick={() => !isSelected && addPredefinedInterestedParty(partyData)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className={`font-medium ${isSelected ? 'text-green-800' : 'text-gray-900'}`}>
                                {partyData.party}
                              </h5>
                              {isSelected && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                            <p className={`text-sm mb-1 ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                              <strong>Requirements:</strong> {partyData.requirements}
                            </p>
                            <p className={`text-sm ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                              <strong>Influence:</strong> {partyData.influence}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Custom Interested Party */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom interested party:</h4>
                <button
                  onClick={addCustomInterestedParty}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Party
                </button>
              </div>

              {/* Selected/Custom Interested Parties */}
              {scopeData.interestedParties.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected interested parties:</h4>
                  <div className="space-y-4">
                    {scopeData.interestedParties.map((party, index) => {
                      const isPredefined = predefinedInterestedParties.some(p => p.party === party.party)
                      return (
                        <div key={index} className={`border rounded-lg p-4 ${isPredefined ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                          {isPredefined ? (
                            // Display predefined party as read-only
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-blue-900">{party.party}</h5>
                                <button
                                  onClick={() => removeInterestedParty(index)}
                                  className="text-red-500 hover:text-red-700 text-lg"
                                >
                                  ×
                                </button>
                              </div>
                              <p className="text-sm text-blue-800 mb-1">
                                <strong>Requirements:</strong> {party.requirements}
                              </p>
                              <p className="text-sm text-blue-800">
                                <strong>Influence:</strong> {party.influence}
                              </p>
                            </div>
                          ) : (
                            // Editable custom party
                            <div>
                              <div className="grid grid-cols-1 gap-3">
                                <input
                                  type="text"
                                  value={party.party}
                                  onChange={(e) => updateInterestedParty(index, 'party', e.target.value)}
                                  placeholder="Interested party (e.g., Customers, Regulators, Partners)"
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  value={party.requirements}
                                  onChange={(e) => updateInterestedParty(index, 'requirements', e.target.value)}
                                  placeholder="Requirements (e.g., GDPR compliance, Data protection)"
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  value={party.influence}
                                  onChange={(e) => updateInterestedParty(index, 'influence', e.target.value)}
                                  placeholder="Influence on scope (e.g., Personal data must be included)"
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <button
                                onClick={() => removeInterestedParty(index)}
                                className="text-red-500 hover:text-red-700 text-sm mt-2"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Step 3: Interfaces & Dependencies</h4>
              <p className="text-blue-800 text-sm">
                <strong>Step 3:</strong> Consider if interfaces and dependencies influence the scope – e.g., if employees of two different departments share the same office and all software and data, then it would be very difficult to include one department in the ISMS scope and not the other.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Interfaces & Dependencies</h3>
                <button
                  onClick={addInterface}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                >
                  Add Interface
                </button>
              </div>
              <div className="space-y-4">
                {scopeData.interfaces.map((interface_, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        value={interface_.system}
                        onChange={(e) => updateInterface(index, 'system', e.target.value)}
                        placeholder="System/Department (e.g., HR and Finance departments)"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={interface_.dependency}
                        onChange={(e) => updateInterface(index, 'dependency', e.target.value)}
                        placeholder="Dependency (e.g., Shared office space and systems)"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={interface_.impact}
                        onChange={(e) => updateInterface(index, 'impact', e.target.value)}
                        placeholder="Impact on scope (e.g., Both departments must be included)"
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => removeInterface(index)}
                      className="text-red-500 hover:text-red-700 text-sm mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Step 4: Define Exclusions</h4>
              <p className="text-blue-800 text-sm">
                <strong>Step 4:</strong> Define exclusions from the scope – e.g., private devices are excluded from the ISMS scope. Provide clear justifications for each exclusion.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Exclusions from Scope</h3>

              {/* Predefined Exclusions */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common exclusions:</h4>
                <div className="space-y-3">
                  {predefinedScopeExclusions.map((exclusionData, index) => {
                    const isSelected = scopeData.exclusions.some(e => e.item === exclusionData.item)
                    return (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-green-50 border-green-200 cursor-not-allowed'
                            : 'bg-white border-gray-200 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                        onClick={() => !isSelected && addPredefinedExclusion(exclusionData)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className={`font-medium ${isSelected ? 'text-green-800' : 'text-gray-900'}`}>
                                {exclusionData.item}
                              </h5>
                              {isSelected && <Check className="w-4 h-4 text-green-600" />}
                            </div>
                            <p className={`text-sm ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                              <strong>Justification:</strong> {exclusionData.justification}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Custom Exclusion */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom exclusion:</h4>
                <button
                  onClick={addExclusion}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Custom Exclusion
                </button>
              </div>

              {/* Selected/Custom Exclusions */}
              {scopeData.exclusions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected exclusions:</h4>
                  <div className="space-y-4">
                    {scopeData.exclusions.map((exclusion, index) => {
                      const isPredefined = predefinedScopeExclusions.some(p => p.item === exclusion.item)
                      return (
                        <div key={index} className={`border rounded-lg p-4 ${isPredefined ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                          {isPredefined ? (
                            // Display predefined exclusion as read-only
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-blue-900">{exclusion.item}</h5>
                                <button
                                  onClick={() => removeExclusion(index)}
                                  className="text-red-500 hover:text-red-700 text-lg"
                                >
                                  ×
                                </button>
                              </div>
                              <p className="text-sm text-blue-800">
                                <strong>Justification:</strong> {exclusion.justification}
                              </p>
                            </div>
                          ) : (
                            // Editable custom exclusion
                            <div>
                              <div className="grid grid-cols-1 gap-3">
                                <input
                                  type="text"
                                  value={exclusion.item}
                                  onChange={(e) => updateExclusion(index, 'item', e.target.value)}
                                  placeholder="Excluded item (e.g., Personal devices, Legacy systems)"
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <textarea
                                  value={exclusion.justification}
                                  onChange={(e) => updateExclusion(index, 'justification', e.target.value)}
                                  placeholder="Justification for exclusion (e.g., Company has no control over personal devices)"
                                  rows={3}
                                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              <button
                                onClick={() => removeExclusion(index)}
                                className="text-red-500 hover:text-red-700 text-sm mt-2"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Step 5: Write the ISMS Scope Document</h4>
              <p className="text-green-800 text-sm mb-3">
                <strong>Step 5:</strong> Write the ISMS scope document based on your analysis from the previous steps.
              </p>
              <div className="text-green-800 text-sm">
                <p className="font-medium mb-2">Complete each section below to build your ISMS scope document:</p>
              </div>
            </div>

            {/* Processes and Services */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">1. Processes and Services Included in Scope</h3>

              {/* Predefined Processes */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common processes and services:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {predefinedProcessesAndServices.map((process, index) => {
                    const isSelected = scopeData.scopeDocument.processesAndServices.includes(process)
                    return (
                      <button
                        key={index}
                        onClick={() => addPredefinedProcess(process)}
                        disabled={isSelected}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{process}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Process Input */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom process or service:</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customProcess}
                    onChange={(e) => setCustomProcess(e.target.value)}
                    placeholder="Enter your custom process or service..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addProcessOrService()}
                  />
                  <button
                    onClick={addProcessOrService}
                    disabled={!customProcess.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Processes */}
              {scopeData.scopeDocument.processesAndServices.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected processes and services:</h4>
                  <div className="space-y-2">
                    {scopeData.scopeDocument.processesAndServices.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-800 text-sm">{item}</span>
                        <button
                          onClick={() => removeProcessOrService(index)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Departments */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">2. Departments/Organizational Units Included in Scope</h3>

              {/* Predefined Departments */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common departments:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {predefinedDepartments.map((department, index) => {
                    const isSelected = scopeData.scopeDocument.departments.includes(department)
                    return (
                      <button
                        key={index}
                        onClick={() => addPredefinedDepartment(department)}
                        disabled={isSelected}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{department}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Department Input */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom department:</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDepartment}
                    onChange={(e) => setCustomDepartment(e.target.value)}
                    placeholder="Enter your custom department..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addDepartment()}
                  />
                  <button
                    onClick={addDepartment}
                    disabled={!customDepartment.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Departments */}
              {scopeData.scopeDocument.departments.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected departments:</h4>
                  <div className="space-y-2">
                    {scopeData.scopeDocument.departments.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-800 text-sm">{item}</span>
                        <button
                          onClick={() => removeDepartment(index)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Physical Locations */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">3. Physical Locations Included in Scope</h3>

              {/* Predefined Locations */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Select from common physical locations:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {predefinedPhysicalLocations.map((location, index) => {
                    const isSelected = scopeData.scopeDocument.physicalLocations.includes(location)
                    return (
                      <button
                        key={index}
                        onClick={() => addPredefinedLocation(location)}
                        disabled={isSelected}
                        className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                          isSelected
                            ? 'bg-green-50 border-green-200 text-green-800 cursor-not-allowed'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{location}</span>
                          {isSelected && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Location Input */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Add a custom physical location:</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="Enter your custom physical location..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addPhysicalLocation()}
                  />
                  <button
                    onClick={addPhysicalLocation}
                    disabled={!customLocation.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Selected Locations */}
              {scopeData.scopeDocument.physicalLocations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Selected physical locations:</h4>
                  <div className="space-y-2">
                    {scopeData.scopeDocument.physicalLocations.map((item, index) => (
                      <div key={index} className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <span className="text-blue-800 text-sm">{item}</span>
                        <button
                          onClick={() => removePhysicalLocation(index)}
                          className="text-red-500 hover:text-red-700 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Exclusions Reference */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">4. Exclusions from Scope</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">Exclusions from Step 4</h4>
                  <span className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
                    {scopeData.exclusions.length} exclusions defined
                  </span>
                </div>
                <p className="text-blue-800 text-sm mb-3">
                  Exclusions are automatically included from your analysis in Step 4.
                  {scopeData.exclusions.length === 0 ? ' Go back to Step 4 to define exclusions.' : ''}
                </p>
                {scopeData.exclusions.length > 0 && (
                  <div className="space-y-2">
                    {scopeData.exclusions.map((exclusion, index) => (
                      <div key={index} className="bg-white border border-blue-200 rounded-lg p-3">
                        <div className="font-medium text-gray-900 text-sm mb-1">{exclusion.item}</div>
                        <div className="text-gray-600 text-xs">Justification: {exclusion.justification}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">5. Additional Notes (Optional)</h3>
              <textarea
                value={scopeData.scopeDocument.additionalNotes}
                onChange={(e) => setScopeData(prev => ({
                  ...prev,
                  scopeDocument: { ...prev.scopeDocument, additionalNotes: e.target.value }
                }))}
                placeholder="Add any additional context, clarifications, or notes about the ISMS scope..."
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Scope Document Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p><strong>Processes/Services:</strong> {scopeData.scopeDocument.processesAndServices.length} defined</p>
                  <p><strong>Departments:</strong> {scopeData.scopeDocument.departments.length} included</p>
                </div>
                <div>
                  <p><strong>Physical Locations:</strong> {scopeData.scopeDocument.physicalLocations.length} included</p>
                  <p><strong>Exclusions:</strong> {scopeData.exclusions.length} defined</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-600"><strong>Analysis Summary:</strong></p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                  <div>
                    <p>Internal Issues: {scopeData.internalIssues.length} identified</p>
                    <p>External Issues: {scopeData.externalIssues.length} identified</p>
                  </div>
                  <div>
                    <p>Interested Parties: {scopeData.interestedParties.length} identified</p>
                    <p>Interfaces & Dependencies: {scopeData.interfaces.length} identified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Error</h4>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Generated Document Display */}
            {generatedDocument && (
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Generated ISMS Scope Document</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                      <button
                        onClick={downloadDocument}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        MD
                      </button>
                      <button
                        onClick={downloadDocx}
                        className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                      >
                        <FileDown className="w-4 h-4" />
                        DOCX
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {generatedDocument}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Define ISMS Scope</h1>
            <p className="text-gray-600 mt-2">Step-by-step guide to defining your ISMS boundaries</p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-blue-700">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
          <span className="text-sm text-gray-500">{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = index === currentStep
            const isCompleted = index < currentStep

            return (
              <div key={index} className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                isActive ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                isCompleted ? 'bg-green-100 text-green-700 border border-green-200' :
                'bg-white text-gray-500 border border-gray-200'
              }`}>
                <Icon className="w-4 h-4" />
                <span className="font-medium">{step.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {steps[currentStep].title}
          </h2>
          <p className="text-gray-600 text-lg">
            {steps[currentStep].description}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          {renderStepContent()}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 rounded-b-xl">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors ${
              currentStep === 0
                ? 'text-gray-400 cursor-not-allowed border-gray-200 bg-gray-100'
                : 'text-gray-700 hover:bg-white border-gray-300 bg-white hover:border-gray-400'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Save className="w-5 h-5" />
              <span className="font-medium">Save Progress</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span className="font-medium">Next Step</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={generateScopeDocument}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">Generating...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">Generate Document</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScopeDefinition