import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Download, AlertTriangle, CheckCircle, Computer, Smartphone, Database, Wifi, Server, Shield, FileText, Users } from 'lucide-react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, BorderStyle, Table, TableRow, TableCell, WidthType, VerticalAlign } from 'docx'

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
  controlName: string
  status: 'applicable' | 'not-applicable' | 'partially-applicable'
  justification: string
  implementationNotes: string
}

interface PolicyRule {
  id: string
  category: string
  description: string
  ruleType: 'allowed' | 'restricted' | 'prohibited'
  selected: boolean
}

interface AssetSubcategory {
  id: string
  name: string
  description: string
  selected: boolean
  policyRules: PolicyRule[]
}

interface AssetCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  selected: boolean
  subcategories: AssetSubcategory[]
}

interface PolicyData {
  assetCategories: AssetCategory[]
  generalRules: PolicyRule[]
}

interface Props {
  scopeData: ScopeData | null
}

const AcceptableUsePolicy: React.FC<Props> = ({ scopeData }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [integrationStatus, setIntegrationStatus] = useState({
    scope: false,
    soa: false,
    riskAssessment: false,
    riskTreatment: false
  })

  const [policyData, setPolicyData] = useState<PolicyData>({
    assetCategories: [
      {
        id: 'computing-devices',
        name: 'Computing Devices',
        description: 'Laptops, desktops, workstations, and mobile devices',
        icon: Computer,
        selected: false,
        subcategories: [
          {
            id: 'laptops-desktops',
            name: 'Laptops & Desktops',
            description: 'Corporate laptops, desktops, and workstations',
            selected: false,
            policyRules: [
              { id: 'cd-1', category: 'Security', description: 'Use strong passwords and multi-factor authentication', ruleType: 'allowed', selected: false },
              { id: 'cd-2', category: 'Usage', description: 'Install unauthorized software', ruleType: 'prohibited', selected: false },
              { id: 'cd-3', category: 'Security', description: 'Keep operating systems and software up to date', ruleType: 'allowed', selected: false },
              { id: 'cd-4', category: 'Access', description: 'Share login credentials with colleagues', ruleType: 'prohibited', selected: false },
              { id: 'cd-5', category: 'Usage', description: 'Use devices for personal activities during work hours', ruleType: 'restricted', selected: false }
            ]
          },
          {
            id: 'mobile-devices',
            name: 'Mobile Devices',
            description: 'Smartphones, tablets, and other mobile computing devices',
            selected: false,
            policyRules: [
              { id: 'md-1', category: 'Security', description: 'Enable device encryption and screen locks', ruleType: 'allowed', selected: false },
              { id: 'md-2', category: 'Access', description: 'Connect to unsecured public Wi-Fi networks', ruleType: 'prohibited', selected: false },
              { id: 'md-3', category: 'Usage', description: 'Install apps from official app stores only', ruleType: 'allowed', selected: false },
              { id: 'md-4', category: 'Storage', description: 'Store sensitive company data without proper encryption', ruleType: 'prohibited', selected: false }
            ]
          }
        ]
      },
      {
        id: 'network-systems',
        name: 'Network & Systems',
        description: 'Network infrastructure, servers, and system resources',
        icon: Wifi,
        selected: false,
        subcategories: [
          {
            id: 'network-access',
            name: 'Network Access',
            description: 'Corporate networks, Wi-Fi, and internet access',
            selected: false,
            policyRules: [
              { id: 'na-1', category: 'Access', description: 'Use VPN for remote access to corporate networks', ruleType: 'allowed', selected: false },
              { id: 'na-2', category: 'Security', description: 'Attempt to bypass network security controls', ruleType: 'prohibited', selected: false },
              { id: 'na-3', category: 'Usage', description: 'Access inappropriate or non-work-related websites', ruleType: 'restricted', selected: false },
              { id: 'na-4', category: 'Monitoring', description: 'Network usage may be monitored for security purposes', ruleType: 'allowed', selected: false }
            ]
          },
          {
            id: 'servers-systems',
            name: 'Servers & Systems',
            description: 'Production servers, development systems, and infrastructure',
            selected: false,
            policyRules: [
              { id: 'ss-1', category: 'Access', description: 'Access systems only with proper authorization', ruleType: 'allowed', selected: false },
              { id: 'ss-2', category: 'Security', description: 'Modify system configurations without approval', ruleType: 'prohibited', selected: false },
              { id: 'ss-3', category: 'Backup', description: 'Follow established backup and recovery procedures', ruleType: 'allowed', selected: false }
            ]
          }
        ]
      },
      {
        id: 'data-information',
        name: 'Data & Information',
        description: 'Company data, databases, and information assets',
        icon: Database,
        selected: false,
        subcategories: [
          {
            id: 'sensitive-data',
            name: 'Sensitive Data',
            description: 'Confidential, personal, and classified information',
            selected: false,
            policyRules: [
              { id: 'sd-1', category: 'Classification', description: 'Classify data according to sensitivity levels', ruleType: 'allowed', selected: false },
              { id: 'sd-2', category: 'Access', description: 'Share sensitive data with unauthorized personnel', ruleType: 'prohibited', selected: false },
              { id: 'sd-3', category: 'Storage', description: 'Use approved storage locations for sensitive data', ruleType: 'allowed', selected: false },
              { id: 'sd-4', category: 'Transfer', description: 'Encrypt data when transmitting outside the organization', ruleType: 'allowed', selected: false }
            ]
          },
          {
            id: 'databases',
            name: 'Databases',
            description: 'Corporate databases and data repositories',
            selected: false,
            policyRules: [
              { id: 'db-1', category: 'Access', description: 'Access databases only with proper credentials', ruleType: 'allowed', selected: false },
              { id: 'db-2', category: 'Security', description: 'Run unauthorized queries on production databases', ruleType: 'prohibited', selected: false },
              { id: 'db-3', category: 'Backup', description: 'Follow data retention and disposal policies', ruleType: 'allowed', selected: false }
            ]
          }
        ]
      }
    ],
    generalRules: [
      { id: 'gr-1', category: 'General', description: 'Report security incidents immediately to IT department', ruleType: 'allowed', selected: false },
      { id: 'gr-2', category: 'General', description: 'Attend mandatory security awareness training', ruleType: 'allowed', selected: false },
      { id: 'gr-3', category: 'General', description: 'Use company assets for personal commercial activities', ruleType: 'prohibited', selected: false },
      { id: 'gr-4', category: 'General', description: 'Follow clean desk and clear screen policies', ruleType: 'allowed', selected: false },
      { id: 'gr-5', category: 'General', description: 'Lend or share company equipment without authorization', ruleType: 'prohibited', selected: false }
    ]
  })

  useEffect(() => {
    checkIntegrationStatus()
    loadExistingPolicyData()
  }, [])

  const checkIntegrationStatus = () => {
    const scope = localStorage.getItem('scopeData') !== null
    const soa = localStorage.getItem('statementOfApplicability') !== null
    const riskAssessment = localStorage.getItem('riskAssessment') !== null
    const riskTreatment = localStorage.getItem('riskTreatment') !== null

    setIntegrationStatus({ scope, soa, riskAssessment, riskTreatment })

    // Auto-select asset categories based on previous steps
    if (soa) {
      autoSelectFromSOA()
    }
  }

  const autoSelectFromSOA = () => {
    try {
      const savedSOA = localStorage.getItem('statementOfApplicability')
      if (savedSOA) {
        const soaControls: ControlApplicability[] = JSON.parse(savedSOA)

        // Find applicable controls related to asset management
        const applicableAssetControls = soaControls.filter(control =>
          control.status === 'applicable' &&
          (control.controlId.includes('A.5.9') || // Asset inventory
           control.controlId.includes('A.8') || // Technology assets
           control.controlId.includes('A.7')) // Physical assets
        )

        if (applicableAssetControls.length > 0) {
          // Auto-select relevant asset categories
          setPolicyData(prev => ({
            ...prev,
            assetCategories: prev.assetCategories.map(cat => ({
              ...cat,
              selected: cat.id === 'computing-devices' || cat.id === 'network-systems'
            }))
          }))
        }
      }
    } catch (error) {
      console.error('Error loading SOA data:', error)
    }
  }

  const loadExistingPolicyData = () => {
    // Load any existing policy data
    const savedPolicy = localStorage.getItem('acceptableUsePolicy')
    if (savedPolicy) {
      try {
        const parsedPolicy = JSON.parse(savedPolicy)
        // Ensure icons are preserved by merging with default structure
        setPolicyData(prev => ({
          ...parsedPolicy,
          assetCategories: parsedPolicy.assetCategories.map((savedCat: any) => {
            const defaultCat = prev.assetCategories.find(cat => cat.id === savedCat.id)
            return {
              ...savedCat,
              icon: defaultCat?.icon || Computer // Ensure icon is preserved
            }
          })
        }))
      } catch (error) {
        console.error('Error loading policy data:', error)
      }
    }
  }

  const savePolicyData = (data: PolicyData) => {
    localStorage.setItem('acceptableUsePolicy', JSON.stringify(data))
  }

  const handleCategoryToggle = (categoryId: string) => {
    setPolicyData(prev => {
      const updated = {
        ...prev,
        assetCategories: prev.assetCategories.map(cat =>
          cat.id === categoryId ? { ...cat, selected: !cat.selected } : cat
        )
      }
      savePolicyData(updated)
      return updated
    })
  }

  const handleSubcategoryToggle = (categoryId: string, subcategoryId: string) => {
    setPolicyData(prev => {
      const updated = {
        ...prev,
        assetCategories: prev.assetCategories.map(cat =>
          cat.id === categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub =>
                  sub.id === subcategoryId ? { ...sub, selected: !sub.selected } : sub
                )
              }
            : cat
        )
      }
      savePolicyData(updated)
      return updated
    })
  }

  const handleRuleToggle = (categoryId: string, subcategoryId: string, ruleId: string) => {
    setPolicyData(prev => {
      const updated = {
        ...prev,
        assetCategories: prev.assetCategories.map(cat =>
          cat.id === categoryId
            ? {
                ...cat,
                subcategories: cat.subcategories.map(sub =>
                  sub.id === subcategoryId
                    ? {
                        ...sub,
                        policyRules: sub.policyRules.map(rule =>
                          rule.id === ruleId ? { ...rule, selected: !rule.selected } : rule
                        )
                      }
                    : sub
                )
              }
            : cat
        )
      }
      savePolicyData(updated)
      return updated
    })
  }

  const handleGeneralRuleToggle = (ruleId: string) => {
    setPolicyData(prev => {
      const updated = {
        ...prev,
        generalRules: prev.generalRules.map(rule =>
          rule.id === ruleId ? { ...rule, selected: !rule.selected } : rule
        )
      }
      savePolicyData(updated)
      return updated
    })
  }

  const getRuleTypeColor = (ruleType: string) => {
    switch (ruleType) {
      case 'allowed': return 'text-green-700 bg-green-50 border-green-200'
      case 'restricted': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      case 'prohibited': return 'text-red-700 bg-red-50 border-red-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const generatePolicyDocument = async () => {
    const selectedCategories = policyData.assetCategories.filter(cat => cat.selected)
    const selectedRules = policyData.generalRules.filter(rule => rule.selected)

    const sections: Paragraph[] = []

    // Title
    sections.push(
      new Paragraph({
        text: 'ACCEPTABLE USE OF ASSETS POLICY',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    )

    // Document Control Table
    const documentControlTable = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Document ID', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 30, type: WidthType.PERCENTAGE }
            }),
            new TableCell({
              children: [new Paragraph({ text: 'AUP-001' })],
              verticalAlign: VerticalAlign.CENTER,
              width: { size: 70, type: WidthType.PERCENTAGE }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Version', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: '1.0' })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Effective Date', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: new Date().toLocaleDateString() })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Review Date', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString() })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Owner', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Information Security Manager' })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Approved by', bold: true })],
              shading: { fill: 'E5E7EB' },
              verticalAlign: VerticalAlign.CENTER
            }),
            new TableCell({
              children: [new Paragraph({ text: 'Chief Information Security Officer' })],
              verticalAlign: VerticalAlign.CENTER
            })
          ]
        })
      ]
    })

    sections.push(
      new Paragraph({
        text: 'Document Control',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 200 }
      })
    )

    // Note: Tables can't be pushed to sections array directly, we need to handle it in the document structure

    // 1. PURPOSE
    sections.push(
      new Paragraph({
        text: '1. PURPOSE',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: `This Acceptable Use Policy defines the acceptable use of information and technology assets within ${scopeData?.organizationName || 'the organization'}. This policy ensures the security, integrity, and availability of organizational assets while supporting business operations.`,
        spacing: { after: 200 }
      })
    )

    // 2. SCOPE
    sections.push(
      new Paragraph({
        text: '2. SCOPE',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'This policy applies to:',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: '• All employees, contractors, and third parties',
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: '• All information and technology assets owned or managed by the organization',
        bullet: { level: 0 }
      }),
      new Paragraph({
        text: '• All activities involving organizational assets, whether on-site or remote',
        bullet: { level: 0 },
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Asset categories covered by this policy:',
        spacing: { after: 100, before: 100 }
      })
    )

    selectedCategories.forEach(category => {
      sections.push(
        new Paragraph({
          text: `${category.name}: ${category.description}`,
          bullet: { level: 0 }
        })
      )

      const selectedSubcategories = category.subcategories.filter(sub => sub.selected)
      selectedSubcategories.forEach(subcategory => {
        sections.push(
          new Paragraph({
            text: `${subcategory.name}: ${subcategory.description}`,
            bullet: { level: 1 }
          })
        )
      })
    })

    // 3. POLICY STATEMENTS
    sections.push(
      new Paragraph({
        text: '3. POLICY STATEMENTS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'The following rules and guidelines must be followed when using organizational assets:',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: '3.1 Asset-Specific Rules',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 }
      })
    )

    selectedCategories.forEach(category => {
      const selectedSubcategories = category.subcategories.filter(sub => sub.selected)
      if (selectedSubcategories.length > 0) {
        sections.push(
          new Paragraph({
            text: category.name.toUpperCase(),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 }
          })
        )

        selectedSubcategories.forEach(subcategory => {
          const selectedRules = subcategory.policyRules.filter(rule => rule.selected)
          if (selectedRules.length > 0) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: subcategory.name, bold: true, underline: { type: UnderlineType.SINGLE } })
                ],
                spacing: { before: 100, after: 100 }
              })
            )

            selectedRules.forEach(rule => {
              const prefix = rule.ruleType === 'allowed' ? '✓ ALLOWED:' :
                           rule.ruleType === 'restricted' ? '⚠ RESTRICTED:' :
                           '✗ PROHIBITED:'
              sections.push(
                new Paragraph({
                  children: [
                    new TextRun({ text: `${prefix} `, bold: true }),
                    new TextRun(rule.description)
                  ],
                  bullet: { level: 0 }
                })
              )
            })
          }
        })
      }
    })

    // 3.2 General Rules
    sections.push(
      new Paragraph({
        text: '3.2 General Rules',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 }
      })
    )

    selectedRules.forEach(rule => {
      const prefix = rule.ruleType === 'allowed' ? '✓ REQUIRED:' :
                   rule.ruleType === 'restricted' ? '⚠ RESTRICTED:' :
                   '✗ PROHIBITED:'
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${prefix} `, bold: true }),
            new TextRun(rule.description)
          ],
          bullet: { level: 0 }
        })
      )
    })

    // 4. RESPONSIBILITIES
    sections.push(
      new Paragraph({
        text: '4. RESPONSIBILITIES',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: '4.1 All Users',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ text: 'Comply with all provisions of this policy', bullet: { level: 0 } }),
      new Paragraph({ text: 'Report security incidents and policy violations', bullet: { level: 0 } }),
      new Paragraph({ text: 'Maintain confidentiality of access credentials', bullet: { level: 0 } }),
      new Paragraph({ text: 'Use assets in a manner consistent with business purposes', bullet: { level: 0 }, spacing: { after: 200 } }),
      new Paragraph({
        text: '4.2 Management',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ text: 'Ensure staff are aware of and trained on this policy', bullet: { level: 0 } }),
      new Paragraph({ text: 'Monitor compliance and address violations', bullet: { level: 0 } }),
      new Paragraph({ text: 'Provide necessary resources for policy implementation', bullet: { level: 0 }, spacing: { after: 200 } }),
      new Paragraph({
        text: '4.3 IT Department',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({ text: 'Implement technical controls to support policy enforcement', bullet: { level: 0 } }),
      new Paragraph({ text: 'Monitor asset usage and security incidents', bullet: { level: 0 } }),
      new Paragraph({ text: 'Provide guidance and support for policy compliance', bullet: { level: 0 }, spacing: { after: 200 } })
    )

    // 5. MONITORING AND ENFORCEMENT
    sections.push(
      new Paragraph({
        text: '5. MONITORING AND ENFORCEMENT',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({ text: 'Asset usage may be monitored for security and compliance purposes', bullet: { level: 0 } }),
      new Paragraph({ text: 'Violations of this policy may result in disciplinary action', bullet: { level: 0 } }),
      new Paragraph({ text: 'Serious violations may result in legal action and termination of employment', bullet: { level: 0 } }),
      new Paragraph({ text: 'All monitoring activities will be conducted in accordance with applicable laws', bullet: { level: 0 }, spacing: { after: 200 } })
    )

    // 6. POLICY VIOLATIONS
    sections.push(
      new Paragraph({
        text: '6. POLICY VIOLATIONS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'Suspected violations should be reported to:',
        spacing: { after: 100 }
      }),
      new Paragraph({ text: 'Direct supervisor', bullet: { level: 0 } }),
      new Paragraph({ text: 'IT Security team', bullet: { level: 0 } }),
      new Paragraph({ text: 'Human Resources department', bullet: { level: 0 }, spacing: { after: 200 } }),
      new Paragraph({
        text: 'All violations will be investigated and may result in:',
        spacing: { after: 100, before: 100 }
      }),
      new Paragraph({ text: 'Verbal or written warnings', bullet: { level: 0 } }),
      new Paragraph({ text: 'Suspension of access privileges', bullet: { level: 0 } }),
      new Paragraph({ text: 'Termination of employment', bullet: { level: 0 } }),
      new Paragraph({ text: 'Legal action where appropriate', bullet: { level: 0 }, spacing: { after: 200 } })
    )

    // 7. RELATED DOCUMENTS
    sections.push(
      new Paragraph({
        text: '7. RELATED DOCUMENTS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({ text: 'Information Security Policy', bullet: { level: 0 } }),
      new Paragraph({ text: 'Data Classification Policy', bullet: { level: 0 } }),
      new Paragraph({ text: 'Incident Response Procedure', bullet: { level: 0 } }),
      new Paragraph({ text: 'Employee Handbook', bullet: { level: 0 }, spacing: { after: 200 } })
    )

    // 8. POLICY REVIEW
    sections.push(
      new Paragraph({
        text: '8. POLICY REVIEW',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 300, after: 200 }
      }),
      new Paragraph({
        text: 'This policy will be reviewed annually or when significant changes occur to:',
        spacing: { after: 100 }
      }),
      new Paragraph({ text: 'Organizational structure', bullet: { level: 0 } }),
      new Paragraph({ text: 'Technology infrastructure', bullet: { level: 0 } }),
      new Paragraph({ text: 'Legal or regulatory requirements', bullet: { level: 0 } }),
      new Paragraph({ text: 'Security threat landscape', bullet: { level: 0 }, spacing: { after: 300 } })
    )

    // Footer
    sections.push(
      new Paragraph({
        text: `Generated on ${new Date().toLocaleString()}`,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 }
      }),
      new Paragraph({
        text: 'Generated by ISMS Application - ISO 27001:2022 Compliance Platform',
        alignment: AlignmentType.CENTER,
        italics: true
      })
    )

    // Create document with table included properly
    const documentChildren: (Paragraph | Table)[] = []

    // Add title
    documentChildren.push(sections[0])

    // Add Document Control heading
    documentChildren.push(sections[1])

    // Add Document Control Table
    documentChildren.push(documentControlTable)

    // Add spacing after table
    documentChildren.push(new Paragraph({ text: '', spacing: { after: 200 } }))

    // Add rest of the sections (skip first 2 as they're already added)
    for (let i = 2; i < sections.length; i++) {
      documentChildren.push(sections[i])
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: documentChildren
      }]
    })

    // Generate and download
    const blob = await Packer.toBlob(doc)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Acceptable_Use_Policy_${new Date().toISOString().split('T')[0]}.docx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const renderIntegrationStatus = () => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Status</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { key: 'scope', name: 'Scope Definition', icon: FileText },
          { key: 'soa', name: 'Statement of Applicability', icon: Shield },
          { key: 'riskAssessment', name: 'Risk Assessment', icon: AlertTriangle },
          { key: 'riskTreatment', name: 'Risk Treatment', icon: CheckCircle }
        ].map(({ key, name, icon: Icon }) => (
          <div
            key={key}
            className={`flex items-center gap-2 p-3 rounded-lg border ${
              integrationStatus[key as keyof typeof integrationStatus]
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Icon className={`w-4 h-4 ${
              integrationStatus[key as keyof typeof integrationStatus]
                ? 'text-green-600'
                : 'text-gray-400'
            }`} />
            <span className={`text-sm ${
              integrationStatus[key as keyof typeof integrationStatus]
                ? 'text-green-800 font-medium'
                : 'text-gray-600'
            }`}>
              {name}
            </span>
            {integrationStatus[key as keyof typeof integrationStatus] && (
              <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Integration Overview</h2>
        <p className="text-gray-600 mb-6">
          This Acceptable Use Policy generator integrates with your previous ISMS steps to create a comprehensive policy
          tailored to your organization's assets and controls.
        </p>
      </div>

      {renderIntegrationStatus()}

      {integrationStatus.soa && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">SOA Integration Detected</h4>
              <p className="text-sm text-blue-800">
                Asset categories have been automatically pre-selected based on your applicable ISO 27001 controls.
                You can modify these selections in the next step.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Asset Categories</h2>
        <p className="text-gray-600 mb-6">
          Choose which asset categories should be covered by your Acceptable Use Policy.
          Each category contains specific subcategories and policy rules.
        </p>
      </div>

      <div className="space-y-6">
        {policyData.assetCategories.map((category) => {
          const Icon = category.icon
          return (
            <div
              key={category.id}
              className={`border rounded-lg p-4 transition-all ${
                category.selected
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                  category.selected ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${category.selected ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={category.selected}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-3">{category.description}</p>

                  <div className="text-sm text-gray-500">
                    <strong>Subcategories:</strong> {category.subcategories.map(sub => sub.name).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configure Policy Rules</h2>
        <p className="text-gray-600 mb-6">
          Select specific subcategories and their associated policy rules.
          Rules are color-coded: <span className="text-green-600 font-medium">Allowed</span>,
          <span className="text-yellow-600 font-medium">Restricted</span>,
          <span className="text-red-600 font-medium">Prohibited</span>.
        </p>
      </div>

      <div className="space-y-6">
        {policyData.assetCategories
          .filter(cat => cat.selected)
          .map((category) => {
            const Icon = category.icon
            return (
              <div key={category.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                </div>

                <div className="space-y-4">
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <input
                          type="checkbox"
                          checked={subcategory.selected}
                          onChange={() => handleSubcategoryToggle(category.id, subcategory.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <h4 className="font-medium text-gray-900">{subcategory.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{subcategory.description}</p>

                      {subcategory.selected && (
                        <div className="space-y-2 pl-6">
                          {subcategory.policyRules.map((rule) => (
                            <div key={rule.id} className="flex items-start gap-2">
                              <input
                                type="checkbox"
                                checked={rule.selected}
                                onChange={() => handleRuleToggle(category.id, subcategory.id, rule.id)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRuleTypeColor(rule.ruleType)}`}>
                                    {rule.ruleType?.toUpperCase() || 'UNKNOWN'}
                                  </span>
                                  <span className="text-xs text-gray-500">{rule.category}</span>
                                </div>
                                <p className="text-sm text-gray-700">{rule.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">General Rules</h3>
          <div className="space-y-3">
            {policyData.generalRules.map((rule) => (
              <div key={rule.id} className="flex items-start gap-2">
                <input
                  type="checkbox"
                  checked={rule.selected}
                  onChange={() => handleGeneralRuleToggle(rule.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRuleTypeColor(rule.ruleType)}`}>
                      {rule.ruleType?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{rule.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Review and Export</h2>
        <p className="text-gray-600 mb-6">
          Review your policy configuration and export the final Acceptable Use Policy document.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Policy Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Selected Asset Categories</h4>
            <div className="space-y-2">
              {policyData.assetCategories.filter(cat => cat.selected).map(cat => (
                <div key={cat.id} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                  <span className="text-xs text-gray-500">
                    ({cat.subcategories.filter(sub => sub.selected).length} subcategories)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Policy Rules</h4>
            <div className="text-sm text-gray-600">
              <p className="mb-2">Total selected rules: {
                policyData.assetCategories
                  .filter(cat => cat.selected)
                  .reduce((total, cat) =>
                    total + cat.subcategories
                      .filter(sub => sub.selected)
                      .reduce((subTotal, sub) =>
                        subTotal + sub.policyRules.filter(rule => rule.selected).length, 0
                      ), 0
                  ) + policyData.generalRules.filter(rule => rule.selected).length
              }</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Important Notes</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Ensure all stakeholders review the policy before implementation</li>
                <li>• Schedule training sessions for all affected personnel</li>
                <li>• Establish monitoring and enforcement procedures</li>
                <li>• Plan regular policy reviews and updates</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generatePolicyDocument}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export Policy Document
        </button>
      </div>
    </div>
  )

  const steps = [
    { id: 1, title: 'Integration Overview', component: renderStep1 },
    { id: 2, title: 'Asset Categories', component: renderStep2 },
    { id: 3, title: 'Policy Rules', component: renderStep3 },
    { id: 4, title: 'Review & Export', component: renderStep4 }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Acceptable Use Policy</h1>
        <p className="text-gray-600">
          Control A.5.10 - Create comprehensive policies for the acceptable use of information and technology assets
        </p>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step.id
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-24 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          {steps.map((step) => (
            <span key={step.id} className={currentStep === step.id ? 'font-medium text-blue-600' : ''}>
              {step.title}
            </span>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
        {steps.find(step => step.id === currentStep)?.component()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
          disabled={currentStep === 4}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default AcceptableUsePolicy