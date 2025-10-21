import React, { useState, useEffect, useCallback, ErrorInfo } from 'react'
import { ChevronRight, ChevronLeft, Save, AlertTriangle, Shield, Database, Users, Building, Zap, Eye, FileDown, Copy, Loader2, Plus, Trash2, Edit3, Upload, Download, RefreshCw, CheckCircle, Search } from 'lucide-react'
import * as XLSX from 'xlsx-js-style'

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Something went wrong</h3>
          <p className="text-red-700 mb-4">
            An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

interface Asset {
  id: string
  name: string
  type: 'information' | 'physical' | 'software' | 'human'
  description: string
  owner: string
  classification: 'public' | 'internal' | 'confidential' | 'restricted'
  value: 'low' | 'medium' | 'high' | 'critical'
}

interface Threat {
  id: string
  name: string
  type: 'external' | 'internal' | 'environmental'
  description: string
  source: string
}

interface Vulnerability {
  id: string
  name: string
  description: string
  assetId: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

interface Risk {
  id: string
  assetId: string
  threatId: string
  vulnerabilityId: string
  likelihood: 'very-low' | 'low' | 'medium' | 'high' | 'very-high'
  impact: 'very-low' | 'low' | 'medium' | 'high' | 'very-high'
  riskLevel: 'very-low' | 'low' | 'medium' | 'high' | 'very-high'
  treatment: 'accept' | 'avoid' | 'mitigate' | 'transfer'
  controls: string[]
  owner: string
  reviewDate: string
  status: 'identified' | 'assessed' | 'treated' | 'monitored'
}

interface RiskAssessmentData {
  organizationName: string
  assessmentDate: string
  assessor: string
  methodology: 'qualitative' | 'quantitative' | 'hybrid'
  scope: string
  assets: Asset[]
  threats: Threat[]
  vulnerabilities: Vulnerability[]
  risks: Risk[]
  riskCriteria: {
    likelihood: { [key: string]: string }
    impact: { [key: string]: string }
  }
}

const initialRiskData: RiskAssessmentData = {
  organizationName: '',
  assessmentDate: '',
  assessor: '',
  methodology: 'qualitative',
  scope: '',
  assets: [],
  threats: [],
  vulnerabilities: [],
  risks: [],
  riskCriteria: {
    likelihood: {
      'very-low': 'Rare occurrence (< 1%)',
      'low': 'Unlikely (1-25%)',
      'medium': 'Possible (26-50%)',
      'high': 'Likely (51-75%)',
      'very-high': 'Almost certain (> 75%)'
    },
    impact: {
      'very-low': 'Negligible impact',
      'low': 'Minor disruption',
      'medium': 'Moderate impact',
      'high': 'Major impact',
      'very-high': 'Severe/catastrophic impact'
    }
  }
}

const predefinedAssets = [
  // Information Assets (30 assets)
  { name: 'Customer Database', type: 'information', classification: 'confidential', value: 'critical' },
  { name: 'Financial Records', type: 'information', classification: 'confidential', value: 'critical' },
  { name: 'Employee Personal Data', type: 'information', classification: 'confidential', value: 'high' },
  { name: 'Source Code Repository', type: 'information', classification: 'restricted', value: 'critical' },
  { name: 'Intellectual Property', type: 'information', classification: 'restricted', value: 'critical' },
  { name: 'Business Plans & Strategy', type: 'information', classification: 'confidential', value: 'high' },
  { name: 'Legal Documents & Contracts', type: 'information', classification: 'confidential', value: 'medium' },
  { name: 'Marketing Materials', type: 'information', classification: 'internal', value: 'low' },
  { name: 'Technical Documentation', type: 'information', classification: 'internal', value: 'medium' },
  { name: 'Training Materials', type: 'information', classification: 'public', value: 'low' },
  { name: 'Audit Reports', type: 'information', classification: 'confidential', value: 'medium' },
  { name: 'Security Policies', type: 'information', classification: 'internal', value: 'medium' },
  { name: 'Vendor Information', type: 'information', classification: 'internal', value: 'medium' },
  { name: 'Research Data', type: 'information', classification: 'restricted', value: 'high' },
  { name: 'Customer Communications', type: 'information', classification: 'confidential', value: 'medium' },
  { name: 'Payment Card Data', type: 'information', classification: 'restricted', value: 'critical' },
  { name: 'Healthcare Records', type: 'information', classification: 'restricted', value: 'critical' },
  { name: 'Encryption Keys', type: 'information', classification: 'restricted', value: 'critical' },
  { name: 'API Keys & Secrets', type: 'information', classification: 'restricted', value: 'high' },
  { name: 'Configuration Files', type: 'information', classification: 'confidential', value: 'medium' },
  { name: 'System Logs', type: 'information', classification: 'internal', value: 'medium' },
  { name: 'Backup Data', type: 'information', classification: 'confidential', value: 'high' },
  { name: 'Archived Data', type: 'information', classification: 'internal', value: 'medium' },
  { name: 'Incident Reports', type: 'information', classification: 'confidential', value: 'medium' },
  { name: 'Vulnerability Assessments', type: 'information', classification: 'confidential', value: 'medium' },
  { name: 'Risk Assessments', type: 'information', classification: 'confidential', value: 'medium' },
  { name: 'Compliance Reports', type: 'information', classification: 'confidential', value: 'medium' },
  { name: 'Business Intelligence Data', type: 'information', classification: 'confidential', value: 'high' },
  { name: 'Supplier Contracts', type: 'information', classification: 'confidential', value: 'medium' },
  { name: 'Product Specifications', type: 'information', classification: 'confidential', value: 'high' },

  // Software Assets (30 assets)
  { name: 'Email System', type: 'software', classification: 'internal', value: 'high' },
  { name: 'ERP System', type: 'software', classification: 'internal', value: 'critical' },
  { name: 'CRM Application', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Web Application', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Database Management System', type: 'software', classification: 'internal', value: 'critical' },
  { name: 'Antivirus Software', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Firewall Software', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Backup Software', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Development Tools', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Operating Systems', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Virtual Machine Software', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Monitoring Tools', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Communication Tools', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Project Management Tools', type: 'software', classification: 'internal', value: 'low' },
  { name: 'Version Control System', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Identity Management System', type: 'software', classification: 'internal', value: 'critical' },
  { name: 'Single Sign-On (SSO)', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Multi-Factor Authentication', type: 'software', classification: 'internal', value: 'high' },
  { name: 'VPN Software', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Intrusion Detection System', type: 'software', classification: 'internal', value: 'high' },
  { name: 'SIEM Platform', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Vulnerability Scanner', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Patch Management System', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Configuration Management', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Container Platform', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'API Gateway', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Load Balancer Software', type: 'software', classification: 'internal', value: 'high' },
  { name: 'Business Intelligence Tools', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Document Management System', type: 'software', classification: 'internal', value: 'medium' },
  { name: 'Workflow Management System', type: 'software', classification: 'internal', value: 'medium' },

  // Physical Assets (30 assets)
  { name: 'Database Servers', type: 'physical', classification: 'internal', value: 'critical' },
  { name: 'Web Servers', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'Network Infrastructure', type: 'physical', classification: 'internal', value: 'critical' },
  { name: 'Workstations', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Laptops', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Mobile Devices', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Backup Storage Systems', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'Network Switches', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'Routers', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'Firewalls', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'UPS Systems', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'CCTV Systems', type: 'physical', classification: 'internal', value: 'low' },
  { name: 'Access Control Systems', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Printers & Scanners', type: 'physical', classification: 'internal', value: 'low' },
  { name: 'Storage Media', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Application Servers', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'File Servers', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'Load Balancers', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'Network Attached Storage', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'SAN Storage', type: 'physical', classification: 'internal', value: 'high' },
  { name: 'Tape Backup Systems', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Network Cables', type: 'physical', classification: 'internal', value: 'low' },
  { name: 'Power Distribution Units', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Cooling Systems', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Data Center Racks', type: 'physical', classification: 'internal', value: 'low' },
  { name: 'KVM Switches', type: 'physical', classification: 'internal', value: 'low' },
  { name: 'Wireless Access Points', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Security Cameras', type: 'physical', classification: 'internal', value: 'low' },
  { name: 'Badge Readers', type: 'physical', classification: 'internal', value: 'medium' },
  { name: 'Environmental Sensors', type: 'physical', classification: 'internal', value: 'low' },

  // Human Assets (30 assets)
  { name: 'IT Security Team', type: 'human', classification: 'internal', value: 'critical' },
  { name: 'System Administrators', type: 'human', classification: 'internal', value: 'high' },
  { name: 'Database Administrators', type: 'human', classification: 'internal', value: 'high' },
  { name: 'Software Developers', type: 'human', classification: 'internal', value: 'high' },
  { name: 'Network Engineers', type: 'human', classification: 'internal', value: 'high' },
  { name: 'IT Support Staff', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Security Officers', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Management Team', type: 'human', classification: 'internal', value: 'high' },
  { name: 'Finance Team', type: 'human', classification: 'internal', value: 'high' },
  { name: 'HR Personnel', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Legal Team', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Contractors', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Consultants', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Third-party Vendors', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Cleaning Staff', type: 'human', classification: 'internal', value: 'low' },
  { name: 'DevOps Engineers', type: 'human', classification: 'internal', value: 'high' },
  { name: 'Cloud Engineers', type: 'human', classification: 'internal', value: 'high' },
  { name: 'Security Analysts', type: 'human', classification: 'internal', value: 'high' },
  { name: 'Compliance Officers', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Risk Managers', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Data Protection Officers', type: 'human', classification: 'internal', value: 'high' },
  { name: 'Quality Assurance Team', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Business Analysts', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Project Managers', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Marketing Team', type: 'human', classification: 'internal', value: 'low' },
  { name: 'Sales Team', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Customer Support', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Operations Team', type: 'human', classification: 'internal', value: 'medium' },
  { name: 'Facilities Management', type: 'human', classification: 'internal', value: 'low' },
  { name: 'Maintenance Staff', type: 'human', classification: 'internal', value: 'low' }
]

// Asset-specific threats and vulnerabilities mapping
const assetThreatsMapping = {
  // Information Assets
  'Customer Database': [
    { name: 'SQL Injection Attack', type: 'external', source: 'Cybercriminals, hacktivists' },
    { name: 'Data Breach', type: 'external', source: 'Cybercriminals, nation-state actors' },
    { name: 'Insider Data Theft', type: 'internal', source: 'Malicious employees, contractors' },
    { name: 'Unauthorized Access', type: 'internal', source: 'Privilege escalation, weak controls' },
    { name: 'Database Corruption', type: 'environmental', source: 'Hardware failure, software bugs' }
  ],
  'Financial Records': [
    { name: 'Financial Fraud', type: 'external', source: 'Cybercriminals, organized crime' },
    { name: 'Data Manipulation', type: 'internal', source: 'Malicious insiders, fraud' },
    { name: 'Regulatory Violation', type: 'internal', source: 'Non-compliance, human error' },
    { name: 'Identity Theft', type: 'external', source: 'Cybercriminals, social engineering' },
    { name: 'Accidental Disclosure', type: 'internal', source: 'Human error, misconfiguration' }
  ],
  'Source Code Repository': [
    { name: 'IP Theft', type: 'external', source: 'Competitors, nation-state actors' },
    { name: 'Code Injection', type: 'external', source: 'Malicious developers, supply chain' },
    { name: 'Unauthorized Modification', type: 'internal', source: 'Malicious insiders, compromised accounts' },
    { name: 'Repository Compromise', type: 'external', source: 'Cybercriminals, APT groups' },
    { name: 'Accidental Commit of Secrets', type: 'internal', source: 'Developer error, poor practices' }
  ],

  // Software Assets
  'Email System': [
    { name: 'Phishing Campaign', type: 'external', source: 'Cybercriminals, social engineers' },
    { name: 'Email Spoofing', type: 'external', source: 'Attackers, spammers' },
    { name: 'Business Email Compromise', type: 'external', source: 'Organized crime, fraudsters' },
    { name: 'Malware Distribution', type: 'external', source: 'Cybercriminals, APT groups' },
    { name: 'Data Leakage', type: 'internal', source: 'Human error, misconfiguration' }
  ],
  'Database Management System': [
    { name: 'Database Attack', type: 'external', source: 'Cybercriminals, hackers' },
    { name: 'Privilege Escalation', type: 'internal', source: 'Malicious insiders, compromised accounts' },
    { name: 'Data Corruption', type: 'environmental', source: 'Hardware failure, software bugs' },
    { name: 'Backup Failure', type: 'environmental', source: 'System failure, human error' },
    { name: 'Performance Degradation', type: 'environmental', source: 'Resource exhaustion, poor design' }
  ],

  // Physical Assets
  'Database Servers': [
    { name: 'Physical Theft', type: 'external', source: 'Criminals, industrial espionage' },
    { name: 'Hardware Tampering', type: 'internal', source: 'Malicious insiders, unauthorized access' },
    { name: 'Environmental Damage', type: 'environmental', source: 'Fire, flood, natural disasters' },
    { name: 'Power Failure', type: 'environmental', source: 'Utility outage, equipment failure' },
    { name: 'Unauthorized Physical Access', type: 'external', source: 'Intruders, social engineering' }
  ],
  'Network Infrastructure': [
    { name: 'Network Intrusion', type: 'external', source: 'Cybercriminals, APT groups' },
    { name: 'Equipment Failure', type: 'environmental', source: 'Hardware aging, manufacturing defects' },
    { name: 'Cable Damage', type: 'environmental', source: 'Accidents, construction work' },
    { name: 'Configuration Error', type: 'internal', source: 'Human error, inadequate procedures' },
    { name: 'DDoS Attack', type: 'external', source: 'Attackers, botnets' }
  ],

  // Human Assets
  'IT Security Team': [
    { name: 'Key Personnel Loss', type: 'internal', source: 'Resignation, termination, illness' },
    { name: 'Social Engineering', type: 'external', source: 'Attackers, social engineers' },
    { name: 'Insider Threat', type: 'internal', source: 'Malicious employees, disgruntled staff' },
    { name: 'Skill Gap', type: 'internal', source: 'Inadequate training, technology evolution' },
    { name: 'Burnout/Stress', type: 'internal', source: 'Workload, pressure, inadequate resources' }
  ],
  'System Administrators': [
    { name: 'Privilege Abuse', type: 'internal', source: 'Malicious insiders, compromised accounts' },
    { name: 'Configuration Error', type: 'internal', source: 'Human error, inadequate procedures' },
    { name: 'Targeted Attack', type: 'external', source: 'APT groups, cybercriminals' },
    { name: 'Knowledge Loss', type: 'internal', source: 'Staff turnover, inadequate documentation' },
    { name: 'Unauthorized Changes', type: 'internal', source: 'Poor procedures, lack of oversight' }
  ]
}

const assetVulnerabilitiesMapping = {
  // Information Assets
  'Customer Database': [
    { name: 'Weak Database Encryption', severity: 'high' },
    { name: 'Insufficient Access Controls', severity: 'high' },
    { name: 'Missing Data Backup', severity: 'medium' },
    { name: 'Inadequate Audit Logging', severity: 'medium' },
    { name: 'Unpatched Database Software', severity: 'high' }
  ],
  'Financial Records': [
    { name: 'Inadequate Data Classification', severity: 'medium' },
    { name: 'Weak Authentication', severity: 'high' },
    { name: 'Insufficient Data Retention Controls', severity: 'medium' },
    { name: 'Missing Data Loss Prevention', severity: 'high' },
    { name: 'Poor Data Segregation', severity: 'medium' }
  ],
  'Source Code Repository': [
    { name: 'Weak Access Controls', severity: 'high' },
    { name: 'Missing Code Signing', severity: 'medium' },
    { name: 'Inadequate Branch Protection', severity: 'medium' },
    { name: 'Insufficient Code Review', severity: 'medium' },
    { name: 'Exposed Secrets in Code', severity: 'high' }
  ],

  // Software Assets
  'Email System': [
    { name: 'Missing Email Security Gateway', severity: 'high' },
    { name: 'Weak Spam Filtering', severity: 'medium' },
    { name: 'Insufficient Email Encryption', severity: 'high' },
    { name: 'Missing DLP Controls', severity: 'medium' },
    { name: 'Outdated Email Software', severity: 'high' }
  ],
  'Database Management System': [
    { name: 'Default Credentials', severity: 'critical' },
    { name: 'Unencrypted Database Storage', severity: 'high' },
    { name: 'Missing Database Firewall', severity: 'medium' },
    { name: 'Insufficient Monitoring', severity: 'medium' },
    { name: 'Weak Database Configuration', severity: 'high' }
  ],

  // Physical Assets
  'Database Servers': [
    { name: 'Inadequate Physical Security', severity: 'high' },
    { name: 'Missing Environmental Controls', severity: 'medium' },
    { name: 'Insufficient Redundancy', severity: 'medium' },
    { name: 'Weak Asset Tracking', severity: 'low' },
    { name: 'Missing Hardware Security Modules', severity: 'medium' }
  ],
  'Network Infrastructure': [
    { name: 'Unencrypted Network Traffic', severity: 'high' },
    { name: 'Default Network Configurations', severity: 'high' },
    { name: 'Missing Network Segmentation', severity: 'high' },
    { name: 'Insufficient Network Monitoring', severity: 'medium' },
    { name: 'Weak Wireless Security', severity: 'high' }
  ],

  // Human Assets
  'IT Security Team': [
    { name: 'Insufficient Security Training', severity: 'medium' },
    { name: 'Lack of Background Checks', severity: 'medium' },
    { name: 'Inadequate Succession Planning', severity: 'medium' },
    { name: 'Missing Separation of Duties', severity: 'high' },
    { name: 'Weak Identity Management', severity: 'high' }
  ],
  'System Administrators': [
    { name: 'Excessive Privileges', severity: 'high' },
    { name: 'Shared Administrative Accounts', severity: 'high' },
    { name: 'Insufficient Monitoring', severity: 'medium' },
    { name: 'Weak Password Policies', severity: 'medium' },
    { name: 'Missing Multi-Factor Authentication', severity: 'high' }
  ]
}

// Generic threats and vulnerabilities for assets not specifically mapped
const genericThreats = [
  { name: 'Malware Attack', type: 'external', source: 'Cybercriminals, automated attacks' },
  { name: 'Phishing Attack', type: 'external', source: 'Social engineering, email campaigns' },
  { name: 'DDoS Attack', type: 'external', source: 'Attackers, botnets' },
  { name: 'Data Theft', type: 'internal', source: 'Malicious insiders, contractors' },
  { name: 'Accidental Deletion', type: 'internal', source: 'Human error, inadequate training' },
  { name: 'Power Outage', type: 'environmental', source: 'Utility failures, natural disasters' },
  { name: 'Fire/Flood', type: 'environmental', source: 'Natural disasters, accidents' },
  { name: 'Hardware Failure', type: 'environmental', source: 'Equipment aging, manufacturing defects' },
  { name: 'Unauthorized Access', type: 'external', source: 'Cybercriminals, social engineering' },
  { name: 'System Compromise', type: 'external', source: 'APT groups, nation-state actors' }
]

const genericVulnerabilities = [
  { name: 'Missing Security Patches', severity: 'high' },
  { name: 'Weak Access Controls', severity: 'high' },
  { name: 'Insufficient Logging', severity: 'medium' },
  { name: 'Lack of Encryption', severity: 'high' },
  { name: 'Poor Physical Security', severity: 'medium' },
  { name: 'Inadequate Backup Procedures', severity: 'medium' },
  { name: 'Insufficient Training', severity: 'medium' },
  { name: 'Outdated Software', severity: 'high' },
  { name: 'Weak Authentication', severity: 'high' },
  { name: 'Missing Monitoring', severity: 'medium' }
]

// Mapping of threats to their relevant vulnerabilities
const threatToVulnerabilityMapping: Record<string, string[]> = {
  // External threats
  'SQL Injection Attack': ['Weak Database Encryption', 'Insufficient Access Controls', 'Unpatched Database Software', 'Inadequate Audit Logging'],
  'Data Breach': ['Weak Database Encryption', 'Insufficient Access Controls', 'Lack of Encryption', 'Poor Physical Security'],
  'Malware Attack': ['Missing Security Patches', 'Outdated Software', 'Weak Access Controls', 'Insufficient Monitoring'],
  'Phishing Attack': ['Insufficient Training', 'Weak Authentication', 'Missing Security Patches'],
  'DDoS Attack': ['Inadequate Network Infrastructure', 'Missing Monitoring', 'Insufficient Bandwidth'],
  'Ransomware Attack': ['Missing Security Patches', 'Inadequate Backup Procedures', 'Weak Access Controls', 'Insufficient Training'],
  'Social Engineering': ['Insufficient Training', 'Weak Authentication', 'Poor Physical Security'],
  'Man-in-the-Middle Attack': ['Lack of Encryption', 'Weak Network Security', 'Insufficient Monitoring'],
  'Zero-day Exploit': ['Missing Security Patches', 'Inadequate Network Infrastructure', 'Insufficient Monitoring'],
  'Targeted Attack': ['Weak Access Controls', 'Missing Security Patches', 'Insufficient Monitoring', 'Inadequate Audit Logging'],

  // Internal threats
  'Insider Data Theft': ['Insufficient Access Controls', 'Inadequate Audit Logging', 'Poor Physical Security'],
  'Unauthorized Access': ['Weak Access Controls', 'Weak Authentication', 'Inadequate Audit Logging'],
  'Data Theft': ['Insufficient Access Controls', 'Poor Physical Security', 'Inadequate Audit Logging'],
  'Accidental Deletion': ['Inadequate Backup Procedures', 'Insufficient Training', 'Weak Access Controls'],
  'Privilege Abuse': ['Insufficient Access Controls', 'Inadequate Audit Logging', 'Weak Authentication'],
  'Configuration Error': ['Insufficient Training', 'Inadequate Documentation', 'Weak Access Controls'],
  'Insider Threat': ['Insufficient Access Controls', 'Inadequate Audit Logging', 'Poor Physical Security'],
  'Key Personnel Loss': ['Inadequate Documentation', 'Insufficient Training', 'Poor Succession Planning'],
  'Skill Gap': ['Insufficient Training', 'Inadequate Documentation', 'Poor Knowledge Management'],
  'Burnout/Stress': ['Insufficient Resources', 'Poor Work-Life Balance', 'Inadequate Support'],
  'Knowledge Loss': ['Inadequate Documentation', 'Poor Knowledge Management', 'Insufficient Training'],

  // Environmental threats
  'Database Corruption': ['Missing Data Backup', 'Inadequate Backup Procedures', 'Hardware Failure'],
  'Power Outage': ['Inadequate Power Backup', 'Poor Infrastructure Planning', 'Missing UPS Systems'],
  'Fire/Flood': ['Poor Physical Security', 'Inadequate Disaster Recovery', 'Missing Environmental Controls'],
  'Hardware Failure': ['Inadequate Backup Procedures', 'Poor Infrastructure Planning', 'Missing Redundancy'],
  'Network Failure': ['Inadequate Network Infrastructure', 'Poor Infrastructure Planning', 'Missing Redundancy'],
  'Building Access Issues': ['Poor Physical Security', 'Inadequate Access Controls', 'Missing Environmental Controls']
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

interface RiskAssessmentProps {
  scopeData?: ScopeData
  onAssessmentComplete?: (riskData: RiskAssessmentData) => void
}

const RiskAssessment: React.FC<RiskAssessmentProps> = ({ scopeData, onAssessmentComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [riskData, setRiskData] = useState<RiskAssessmentData>({
    ...initialRiskData,
    organizationName: scopeData?.organizationName || initialRiskData.organizationName
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [assetFilter, setAssetFilter] = useState<'all' | 'information' | 'software' | 'physical' | 'human'>('all')
  const [assetSearchTerm, setAssetSearchTerm] = useState('')
  const [showCustomAssetForm, setShowCustomAssetForm] = useState(false)
  const [selectedAssetForRisk, setSelectedAssetForRisk] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [savedAssessments, setSavedAssessments] = useState<Array<{id: string, name: string, date: string}>>([])
  const [showLoadDialog, setShowLoadDialog] = useState(false)

  // Keyboard navigation


  // Auto-clear messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Storage keys
  const STORAGE_KEY = 'isms-risk-assessment'
  const SAVED_ASSESSMENTS_KEY = 'isms-saved-assessments'
  const AUTO_SAVE_KEY = 'isms-auto-save'

  // Auto-save functionality
  const saveToStorage = useCallback(async (data: RiskAssessmentData, isAutoSave = false) => {
    if (!isAutoSave) {
      setIsSaving(true)
    }

    try {
      // Validate data before saving
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format for saving')
      }

      const saveData = {
        ...data,
        savedAt: new Date().toISOString(),
        currentStep
      }

      // Check localStorage availability
      if (typeof Storage === 'undefined') {
        throw new Error('localStorage is not available')
      }

      const serializedData = JSON.stringify(saveData)

      // Check data size (localStorage has ~5MB limit)
      if (serializedData.length > 4.5 * 1024 * 1024) {
        throw new Error('Data too large to save (exceeds 4.5MB)')
      }

      // Simulate async operation for better UX
      await new Promise(resolve => setTimeout(resolve, 500))

      if (isAutoSave) {
        localStorage.setItem(AUTO_SAVE_KEY, serializedData)
      } else {
        localStorage.setItem(STORAGE_KEY, serializedData)
        setLastSaved(new Date())
        setHasUnsavedChanges(false)
        setSuccessMessage('Assessment saved successfully!')
        setError(null)
      }

      // Dispatch custom event to notify other components (like Dashboard)
      window.dispatchEvent(new Event('isms-data-updated'))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save assessment data'
      setError(`Save Error: ${errorMessage}`)
    } finally {
      if (!isAutoSave) {
        setIsSaving(false)
      }
    }
  }, [currentStep])

  // Load from storage
  const loadFromStorage = useCallback((key: string = STORAGE_KEY) => {
    try {
      const saved = localStorage.getItem(key)
      if (saved) {
        const parsedData = JSON.parse(saved)
        setRiskData(parsedData)
        if (parsedData.currentStep !== undefined) {
          setCurrentStep(parsedData.currentStep)
        }
        setLastSaved(parsedData.savedAt ? new Date(parsedData.savedAt) : null)
        setHasUnsavedChanges(false)
        return true
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
      setError('Failed to load saved assessment data')
    }
    return false
  }, [])

  // Save assessment with name
  const saveAssessmentWithName = useCallback((name: string) => {
    try {
      const assessmentId = `assessment-${Date.now()}`
      const saveData = {
        ...riskData,
        savedAt: new Date().toISOString(),
        currentStep
      }

      // Save the assessment data
      localStorage.setItem(`${STORAGE_KEY}-${assessmentId}`, JSON.stringify(saveData))

      // Update saved assessments list
      const existingSaves = JSON.parse(localStorage.getItem(SAVED_ASSESSMENTS_KEY) || '[]')
      const newSave = {
        id: assessmentId,
        name: name,
        date: new Date().toISOString()
      }
      existingSaves.push(newSave)
      localStorage.setItem(SAVED_ASSESSMENTS_KEY, JSON.stringify(existingSaves))
      setSavedAssessments(existingSaves)

      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error('Failed to save assessment:', error)
      setError('Failed to save assessment')
    }
  }, [riskData, currentStep])

  // Load saved assessments list
  const loadSavedAssessments = useCallback(() => {
    try {
      const saved = localStorage.getItem(SAVED_ASSESSMENTS_KEY)
      if (saved) {
        setSavedAssessments(JSON.parse(saved))
      }
    } catch (error) {
      console.error('Failed to load saved assessments:', error)
    }
  }, [])

  // Load specific assessment
  const loadAssessment = useCallback((assessmentId: string) => {
    const success = loadFromStorage(`${STORAGE_KEY}-${assessmentId}`)
    if (success) {
      setShowLoadDialog(false)
    }
  }, [loadFromStorage])

  // Export assessment data
  const exportAssessmentData = useCallback(() => {
    try {
      const exportData = {
        ...riskData,
        exportedAt: new Date().toISOString(),
        appVersion: '1.0.0'
      }
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${riskData.organizationName.replace(/\s+/g, '-').toLowerCase()}-assessment-data.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export assessment:', error)
      setError('Failed to export assessment data')
    }
  }, [riskData])

  // Import assessment data
  const importAssessmentData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        // Validate the imported data structure
        if (importedData.organizationName && importedData.assets && importedData.risks) {
          setRiskData(importedData)
          setHasUnsavedChanges(true)
          setError(null)
        } else {
          setError('Invalid assessment data format')
        }
      } catch (error) {
        console.error('Failed to import assessment:', error)
        setError('Failed to import assessment data')
      }
    }
    reader.readAsText(file)
    // Reset the input
    event.target.value = ''
  }, [])

  // Validation functions
  const sanitizeInput = (input: string, maxLength: number = 255): string => {
    return input.trim().slice(0, maxLength).replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateDate = (date: string): boolean => {
    const dateObj = new Date(date)
    return !isNaN(dateObj.getTime()) && dateObj >= new Date('1900-01-01')
  }

  const validateRequired = (value: string, fieldName: string): string | null => {
    if (!value || value.trim().length === 0) {
      return `${fieldName} is required`
    }
    return null
  }

  const validateAssetName = (name: string): string | null => {
    if (!name || name.trim().length === 0) {
      return 'Asset name is required'
    }
    if (name.length > 100) {
      return 'Asset name must be less than 100 characters'
    }
    if (riskData.assets.some(asset => asset.name.toLowerCase() === name.toLowerCase())) {
      return 'Asset with this name already exists'
    }
    return null
  }

  // Auto-save effect
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges) {
        saveToStorage(riskData, true)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [riskData, hasUnsavedChanges, saveToStorage])

  // Load on mount
  useEffect(() => {
    // Check for auto-save first, then regular save
    const autoSaveExists = localStorage.getItem(AUTO_SAVE_KEY)
    if (autoSaveExists) {
      loadFromStorage(AUTO_SAVE_KEY)
    } else {
      loadFromStorage()
    }

    loadSavedAssessments()
  }, [loadFromStorage, loadSavedAssessments])

  // Track changes
  useEffect(() => {
    setHasUnsavedChanges(true)
  }, [riskData, currentStep])
  const [newRisk, setNewRisk] = useState<{
    threatId: string
    vulnerabilityId: string
    likelihood: string
    impact: string
    controls: string[]
    owner: string
    reviewDate: string
  }>({
    threatId: '',
    vulnerabilityId: '',
    likelihood: 'medium',
    impact: 'medium',
    controls: [],
    owner: 'Security Team',
    reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })
  const [customAsset, setCustomAsset] = useState<Omit<Asset, 'id'>>({
    name: '',
    type: 'information',
    description: '',
    owner: '',
    classification: 'internal',
    value: 'medium'
  })

  const steps = [
    {
      title: 'Assessment Setup',
      description: 'Define assessment scope and methodology',
      icon: Shield
    },
    {
      title: 'Asset Identification',
      description: 'Identify and classify information assets',
      icon: Database
    },
    {
      title: 'Risk Analysis',
      description: 'Analyze threats, vulnerabilities, and evaluate risks for each asset',
      icon: Zap
    },
    {
      title: 'Risk Treatment',
      description: 'Define treatment plans for risks',
      icon: Shield
    }
  ]

  const calculateRiskLevel = (likelihood: string, impact: string): string => {
    const likelihoodValue = { 'very-low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very-high': 5 }[likelihood] || 1
    const impactValue = { 'very-low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very-high': 5 }[impact] || 1
    const riskScore = likelihoodValue * impactValue

    if (riskScore <= 4) return 'very-low'
    if (riskScore <= 8) return 'low'
    if (riskScore <= 12) return 'medium'
    if (riskScore <= 16) return 'high'
    return 'very-high'
  }

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    // Validate asset name
    const nameValidation = validateAssetName(asset.name)
    if (nameValidation) {
      setError(nameValidation)
      return false
    }

    // Sanitize asset data
    const sanitizedAsset = {
      ...asset,
      name: sanitizeInput(asset.name, 100),
      owner: sanitizeInput(asset.owner, 100),
      description: sanitizeInput(asset.description, 500)
    }

    const newAsset: Asset = {
      ...sanitizedAsset,
      id: generateStableId('asset', sanitizedAsset.name)
    }

    setRiskData(prev => ({
      ...prev,
      assets: [...prev.assets, newAsset]
    }))
    setHasUnsavedChanges(true)
    return true
  }

  const removeAsset = (assetId: string) => {
    setRiskData(prev => ({
      ...prev,
      assets: prev.assets.filter(asset => asset.id !== assetId),
      // Also remove related vulnerabilities and risks
      vulnerabilities: prev.vulnerabilities.filter(vuln => vuln.assetId !== assetId),
      risks: prev.risks.filter(risk => risk.assetId !== assetId)
    }))
  }

  const togglePredefinedAsset = (predefinedAsset: typeof predefinedAssets[0]) => {
    const existingAsset = riskData.assets.find(asset => asset.name === predefinedAsset.name)

    if (existingAsset) {
      removeAsset(existingAsset.id)
    } else {
      addAsset({
        name: predefinedAsset.name,
        type: predefinedAsset.type,
        description: `Standard ${predefinedAsset.type} asset: ${predefinedAsset.name.toLowerCase()}`,
        owner: 'To be defined',
        classification: predefinedAsset.classification,
        value: predefinedAsset.value
      })
    }
  }

  const addCustomAsset = () => {
    // Clear any previous errors
    setError('')

    // Validate required fields
    if (!customAsset.name.trim()) {
      setError('Asset name is required')
      return
    }
    if (!customAsset.description.trim()) {
      setError('Asset description is required')
      return
    }
    if (!customAsset.owner.trim()) {
      setError('Asset owner is required')
      return
    }

    // Try to add the asset (addAsset will handle validation and sanitization)
    const success = addAsset(customAsset)
    if (success) {
      setCustomAsset({
        name: '',
        type: 'information',
        description: '',
        owner: '',
        classification: 'internal',
        value: 'medium'
      })
      setShowCustomAssetForm(false)
    }
  }

  const addThreat = (threat: Omit<Threat, 'id'>) => {
    const newThreat: Threat = {
      ...threat,
      id: `threat-${Date.now()}`
    }
    setRiskData(prev => ({
      ...prev,
      threats: [...prev.threats, newThreat]
    }))
  }

  const addVulnerability = (vulnerability: Omit<Vulnerability, 'id'>) => {
    const newVulnerability: Vulnerability = {
      ...vulnerability,
      id: `vuln-${Date.now()}`
    }
    setRiskData(prev => ({
      ...prev,
      vulnerabilities: [...prev.vulnerabilities, newVulnerability]
    }))
  }

  const addRisk = (risk: Omit<Risk, 'id' | 'riskLevel'>) => {
    const riskLevel = calculateRiskLevel(risk.likelihood, risk.impact)
    const newRisk: Risk = {
      ...risk,
      id: `risk-${Date.now()}`,
      riskLevel
    }
    setRiskData(prev => ({
      ...prev,
      risks: [...prev.risks, newRisk]
    }))
  }

  // Generate stable IDs using crypto or fallback
  const generateStableId = (prefix: string, name: string) => {
    // Create a simple hash from the name for stable IDs
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return `${prefix}-${Math.abs(hash)}`
  }

  // Get asset-specific threats and vulnerabilities with proper data structure
  const getAssetThreats = (assetName: string) => {
    const threats = assetThreatsMapping[assetName] || genericThreats
    return threats.map(threat => ({
      ...threat,
      id: generateStableId('threat', `${assetName}-${threat.name}`)
    }))
  }

  const getAssetVulnerabilities = (assetName: string) => {
    const vulnerabilities = assetVulnerabilitiesMapping[assetName] || genericVulnerabilities
    return vulnerabilities.map(vuln => ({
      ...vuln,
      id: generateStableId('vuln', `${assetName}-${vuln.name}`)
    }))
  }

  // Add threats and vulnerabilities to global arrays when they're used
  const ensureThreatsAndVulnerabilitiesExist = (assetName: string) => {
    const assetThreats = getAssetThreats(assetName)
    const assetVulns = getAssetVulnerabilities(assetName)

    // Add threats to global array if they don't exist
    assetThreats.forEach(threat => {
      if (!riskData.threats.find(t => t.id === threat.id)) {
        setRiskData(prev => ({
          ...prev,
          threats: [...prev.threats, threat]
        }))
      }
    })

    // Add vulnerabilities to global array if they don't exist
    assetVulns.forEach(vuln => {
      if (!riskData.vulnerabilities.find(v => v.id === vuln.id)) {
        setRiskData(prev => ({
          ...prev,
          vulnerabilities: [...prev.vulnerabilities, {
            ...vuln,
            assetId: riskData.assets.find(a => a.name === assetName)?.id || '',
            description: `${vuln.name} affecting ${assetName}`
          }]
        }))
      }
    })
  }

  const addAssetThreatRisk = () => {
    console.log('addAssetThreatRisk called:', {
      selectedAssetForRisk,
      threatId: newRisk.threatId,
      vulnerabilityId: newRisk.vulnerabilityId,
      currentRisks: riskData.risks.length
    })

    if (selectedAssetForRisk && newRisk.threatId && newRisk.vulnerabilityId) {
      console.log('Adding risk...')

      addRisk({
        assetId: selectedAssetForRisk,
        threatId: newRisk.threatId,
        vulnerabilityId: newRisk.vulnerabilityId,
        likelihood: newRisk.likelihood,
        impact: newRisk.impact,
        treatment: 'mitigate',
        controls: newRisk.controls,
        owner: newRisk.owner,
        reviewDate: newRisk.reviewDate,
        status: 'assessed'
      })

      console.log('Risk added, resetting form...')

      // Reset form (keep asset selected to allow adding more risks)
      setNewRisk({
        threatId: '',
        vulnerabilityId: '',
        likelihood: 'medium',
        impact: 'medium',
        controls: [],
        owner: 'Security Team',
        reviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })

      console.log('Form reset complete')
    } else {
      console.log('Validation failed:', {
        hasAsset: !!selectedAssetForRisk,
        hasThreat: !!newRisk.threatId,
        hasVulnerability: !!newRisk.vulnerabilityId
      })
    }
  }

  // Step validation functions
  const validateStep = (stepIndex: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    switch (stepIndex) {
      case 0: // Assessment Setup
        if (!riskData.organizationName.trim()) errors.push('Organization name is required')
        if (!riskData.assessmentDate) errors.push('Assessment date is required')
        if (!riskData.assessor.trim()) errors.push('Assessor is required')
        if (!riskData.scope.trim()) errors.push('Assessment scope is required')
        break
      case 1: // Asset Identification
        if (riskData.assets.length === 0) errors.push('At least one asset must be identified')
        break
      case 2: // Risk Assessment
        if (riskData.risks.length === 0) errors.push('At least one risk must be assessed')
        break
      case 3: // Risk Register
        // No validation needed for final step
        break
    }

    return { isValid: errors.length === 0, errors }
  }

  const getStepCompletionStatus = (stepIndex: number): 'completed' | 'in-progress' | 'not-started' => {
    if (stepIndex < currentStep) return 'completed'
    if (stepIndex === currentStep) return 'in-progress'
    return 'not-started'
  }

  const nextStep = () => {
    // Validate current step before proceeding
    const validation = validateStep(currentStep)
    if (!validation.isValid) {
      setError(`Please complete the current step: ${validation.errors.join(', ')}`)
      return
    }

    if (currentStep < steps.length - 1) {
      setError('') // Clear any errors
      setCurrentStep(currentStep + 1)
      setHasUnsavedChanges(true)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setError('') // Clear any errors
      setCurrentStep(currentStep - 1)
    }
  }

  // Keyboard navigation
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.target && (event.target as Element).tagName === 'INPUT' || (event.target as Element).tagName === 'TEXTAREA') {
      return
    }

    switch (event.key) {
      case 'ArrowLeft':
        if (currentStep > 0) {
          event.preventDefault()
          setCurrentStep(prev => Math.max(0, prev - 1))
        }
        break
      case 'ArrowRight':
        if (currentStep < steps.length - 1) {
          event.preventDefault()
          setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))
        }
        break
      case 'Escape':
        if (showLoadDialog) {
          event.preventDefault()
          setShowLoadDialog(false)
        }
        if (showCustomAssetForm) {
          event.preventDefault()
          setShowCustomAssetForm(false)
        }
        break
      case 's':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          saveToStorage(riskData, false)
        }
        break
    }
  }, [currentStep, showLoadDialog, showCustomAssetForm, riskData, saveToStorage])

  // Keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const generateRiskRegister = () => {
    const content = `
# RISK ASSESSMENT REGISTER

**Organization:** ${riskData.organizationName}
**Assessment Date:** ${riskData.assessmentDate}
**Assessor:** ${riskData.assessor}
**Methodology:** ${riskData.methodology.toUpperCase()}

## ASSESSMENT SCOPE
${riskData.scope}

## IDENTIFIED ASSETS
${riskData.assets.map((asset, i) => `
### ${i + 1}. ${asset.name}
- **Type:** ${asset.type}
- **Classification:** ${asset.classification}
- **Value:** ${asset.value}
- **Owner:** ${asset.owner}
- **Description:** ${asset.description}
`).join('')}

## IDENTIFIED THREATS
${riskData.threats.map((threat, i) => `
### ${i + 1}. ${threat.name}
- **Type:** ${threat.type}
- **Source:** ${threat.source}
- **Description:** ${threat.description}
`).join('')}

## IDENTIFIED VULNERABILITIES
${riskData.vulnerabilities.map((vuln, i) => `
### ${i + 1}. ${vuln.name}
- **Severity:** ${vuln.severity}
- **Asset:** ${riskData.assets.find(a => a.id === vuln.assetId)?.name || 'Unknown'}
- **Description:** ${vuln.description}
`).join('')}

## RISK ANALYSIS
${riskData.risks.length > 0 ? riskData.risks.map((risk, i) => {
  const asset = riskData.assets.find(a => a.id === risk.assetId)
  const threat = riskData.threats.find(t => t.id === risk.threatId)
  const vulnerability = riskData.vulnerabilities.find(v => v.id === risk.vulnerabilityId)
  return `
### Risk ${i + 1}
- **Asset:** ${asset?.name || 'Unknown'}
- **Threat:** ${threat?.name || 'Unknown'}
- **Vulnerability:** ${vulnerability?.name || 'Unknown'}
- **Likelihood:** ${risk.likelihood}
- **Impact:** ${risk.impact}
- **Risk Level:** ${risk.riskLevel}
- **Treatment:** ${risk.treatment}
- **Owner:** ${risk.owner}
- **Review Date:** ${risk.reviewDate}
- **Status:** ${risk.status}
- **Controls:** ${risk.controls.join(', ') || 'None specified'}
`}).join('') : 'No risks have been analyzed yet.'}

## RISK CRITERIA

### Likelihood Scale
${Object.entries(riskData.riskCriteria.likelihood).map(([level, desc]) => `- **${level}:** ${desc}`).join('\n')}

### Impact Scale
${Object.entries(riskData.riskCriteria.impact).map(([level, desc]) => `- **${level}:** ${desc}`).join('\n')}

---
*Risk Assessment generated by ISO 27001 ISMS Tool*
`.trim()
    return content
  }

  const downloadRiskRegister = () => {
    try {
      const content = generatedDocument || generateRiskRegister()

      if (!content || content.trim().length === 0) {
        throw new Error('No content to download')
      }

      const blob = new Blob([content], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')

      const filename = riskData.organizationName
        ? `${riskData.organizationName.replace(/\s+/g, '-').toLowerCase()}-risk-register.md`
        : 'risk-register.md'

      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download risk register:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to download file'
      setError(`Download Error: ${errorMessage}`)
    }
  }

  const downloadRiskRegisterExcel = () => {
    try {
      // Validate that we have data to export
      if (!riskData.organizationName) {
        throw new Error('Organization name is required for Excel export')
      }

      // Create a new workbook
      const wb = XLSX.utils.book_new()

      // Helper function to apply borders to a cell
      const borderStyle = {
        style: 'thin',
        color: { rgb: '000000' }
      }

      const applyBorders = (cell: any) => {
        cell.s = {
          ...cell.s,
          border: {
            top: borderStyle,
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle
          }
        }
      }

      // Helper function to apply header style (blue background, white text, bold, borders)
      const applyHeaderStyle = (cell: any) => {
        cell.s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
          fill: { fgColor: { rgb: '1E3A8A' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: borderStyle,
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle
          }
        }
      }

      // Helper function to apply title style
      const applyTitleStyle = (cell: any) => {
        cell.s = {
          font: { bold: true, sz: 14, color: { rgb: '1E3A8A' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          fill: { fgColor: { rgb: 'E0E7FF' } },
          border: {
            top: borderStyle,
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle
          }
        }
      }

      // Helper function to apply data cell style (with borders)
      const applyDataStyle = (cell: any) => {
        if (!cell.s) cell.s = {}
        cell.s = {
          ...cell.s,
          alignment: { vertical: 'top', wrapText: true },
          border: {
            top: borderStyle,
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle
          }
        }
      }

      // Helper function to apply section header style
      const applySectionStyle = (cell: any) => {
        cell.s = {
          font: { bold: true, sz: 12, color: { rgb: '1E3A8A' } },
          fill: { fgColor: { rgb: 'DBEAFE' } },
          alignment: { horizontal: 'left', vertical: 'center' },
          border: {
            top: borderStyle,
            bottom: borderStyle,
            left: borderStyle,
            right: borderStyle
          }
        }
      }

    // Assessment Overview Sheet
    const overviewData = [
      ['RISK ASSESSMENT OVERVIEW'],
      [''],
      ['Organization:', riskData.organizationName],
      ['Assessment Date:', riskData.assessmentDate],
      ['Assessor:', riskData.assessor],
      ['Methodology:', riskData.methodology.toUpperCase()],
      ['Scope:', riskData.scope],
      [''],
      ['SUMMARY STATISTICS'],
      [''],
      ['Metric', 'Count', 'Percentage'],
      ['Total Assets', riskData.assets.length, '100%'],
      ['Total Risks Assessed', riskData.risks.length, '100%'],
      ['Critical/High Risk Items', riskData.risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'very-high').length, `${Math.round((riskData.risks.filter(r => r.riskLevel === 'high' || r.riskLevel === 'very-high').length / riskData.risks.length) * 100)}%`],
      ['Medium Risk Items', riskData.risks.filter(r => r.riskLevel === 'medium').length, `${Math.round((riskData.risks.filter(r => r.riskLevel === 'medium').length / riskData.risks.length) * 100)}%`],
      ['Low Risk Items', riskData.risks.filter(r => r.riskLevel === 'low' || r.riskLevel === 'very-low').length, `${Math.round((riskData.risks.filter(r => r.riskLevel === 'low' || r.riskLevel === 'very-low').length / riskData.risks.length) * 100)}%`],
      [''],
      ['RISK STATUS'],
      [''],
      ['Status', 'Count'],
      ['Identified', riskData.risks.filter(r => r.status === 'identified').length],
      ['Assessed', riskData.risks.filter(r => r.status === 'assessed').length],
      ['Treated', riskData.risks.filter(r => r.status === 'treated').length],
      ['Monitored', riskData.risks.filter(r => r.status === 'monitored').length]
    ]
    const overviewWS = XLSX.utils.aoa_to_sheet(overviewData)

    // Apply styles to Overview sheet
    // Title
    if (overviewWS['A1']) applyTitleStyle(overviewWS['A1'])

    // Organization info section
    for (let i = 3; i <= 7; i++) {
      if (overviewWS[`A${i}`]) {
        overviewWS[`A${i}`].s = {
          font: { bold: true },
          alignment: { horizontal: 'right' },
          border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle }
        }
      }
      if (overviewWS[`B${i}`]) applyDataStyle(overviewWS[`B${i}`])
    }

    // Summary Statistics section header
    if (overviewWS['A9']) applySectionStyle(overviewWS['A9'])

    // Summary table headers
    ['A11', 'B11', 'C11'].forEach(cell => {
      if (overviewWS[cell]) applyHeaderStyle(overviewWS[cell])
    })

    // Summary table data
    for (let i = 12; i <= 16; i++) {
      ['A', 'B', 'C'].forEach(col => {
        if (overviewWS[`${col}${i}`]) applyDataStyle(overviewWS[`${col}${i}`])
      })
    }

    // Risk Status section header
    if (overviewWS['A18']) applySectionStyle(overviewWS['A18'])

    // Risk Status table headers
    ['A20', 'B20'].forEach(cell => {
      if (overviewWS[cell]) applyHeaderStyle(overviewWS[cell])
    })

    // Risk Status data
    for (let i = 21; i <= 24; i++) {
      ['A', 'B'].forEach(col => {
        if (overviewWS[`${col}${i}`]) applyDataStyle(overviewWS[`${col}${i}`])
      })
    }

    // Set column widths for Overview
    overviewWS['!cols'] = [
      { wch: 25 },
      { wch: 40 },
      { wch: 15 }
    ]

    // Merge title cell
    overviewWS['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }]

    XLSX.utils.book_append_sheet(wb, overviewWS, 'Overview')

    // Assets Sheet
    const assetsData = [
      ['INFORMATION ASSET INVENTORY'],
      [''],
      ['Asset ID', 'Asset Name', 'Type', 'Classification', 'Value', 'Owner', 'Description']
    ]
    riskData.assets.forEach(asset => {
      assetsData.push([
        asset.id,
        asset.name,
        asset.type.charAt(0).toUpperCase() + asset.type.slice(1),
        asset.classification.charAt(0).toUpperCase() + asset.classification.slice(1),
        asset.value.charAt(0).toUpperCase() + asset.value.slice(1),
        asset.owner,
        asset.description
      ])
    })
    const assetsWS = XLSX.utils.aoa_to_sheet(assetsData)

    // Apply styles to Assets sheet
    // Title
    if (assetsWS['A1']) applyTitleStyle(assetsWS['A1'])

    // Headers
    const assetHeaders = ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3']
    assetHeaders.forEach(cell => {
      if (assetsWS[cell]) applyHeaderStyle(assetsWS[cell])
    })

    // Data rows
    for (let i = 4; i <= 3 + riskData.assets.length; i++) {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
        if (assetsWS[`${col}${i}`]) applyDataStyle(assetsWS[`${col}${i}`])
      })
    }

    // Set column widths for Assets
    assetsWS['!cols'] = [
      { wch: 15 },  // Asset ID
      { wch: 25 },  // Asset Name
      { wch: 15 },  // Type
      { wch: 15 },  // Classification
      { wch: 12 },  // Value
      { wch: 20 },  // Owner
      { wch: 50 }   // Description
    ]

    // Merge title
    assetsWS['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }]

    XLSX.utils.book_append_sheet(wb, assetsWS, 'Asset Inventory')

    // Risk Register Sheet (Main Risk Analysis)
    const risksData = [
      ['RISK REGISTER'],
      [''],
      ['Risk ID', 'Asset', 'Threat', 'Vulnerability', 'Existing Controls', 'Likelihood', 'Impact', 'Risk Score', 'Risk Level', 'Treatment', 'Owner', 'Review Date', 'Status']
    ]

    // Sort risks by risk level (critical first)
    const sortedRisks = [...riskData.risks].sort((a, b) => {
      const levelOrder = { 'very-high': 5, 'high': 4, 'medium': 3, 'low': 2, 'very-low': 1 }
      return (levelOrder[b.riskLevel as keyof typeof levelOrder] || 0) - (levelOrder[a.riskLevel as keyof typeof levelOrder] || 0)
    })

    sortedRisks.forEach(risk => {
      const asset = riskData.assets.find(a => a.id === risk.assetId)
      const threat = riskData.threats.find(t => t.id === risk.threatId)
      const vulnerability = riskData.vulnerabilities.find(v => v.id === risk.vulnerabilityId)

      // Calculate risk score
      const likelihoodValues = { 'very-low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very-high': 5 }
      const impactValues = { 'very-low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very-high': 5 }
      const likelihoodScore = likelihoodValues[risk.likelihood as keyof typeof likelihoodValues] || 0
      const impactScore = impactValues[risk.impact as keyof typeof impactValues] || 0
      const riskScore = likelihoodScore * impactScore

      risksData.push([
        risk.id,
        asset?.name || 'Unknown',
        threat?.name || 'Unknown',
        vulnerability?.name || 'Unknown',
        risk.controls?.join('; ') || 'None',
        risk.likelihood.replace('-', ' ').toUpperCase(),
        risk.impact.replace('-', ' ').toUpperCase(),
        riskScore,
        risk.riskLevel.replace('-', ' ').toUpperCase(),
        risk.treatment.charAt(0).toUpperCase() + risk.treatment.slice(1),
        risk.owner || 'Unassigned',
        risk.reviewDate || 'Not set',
        risk.status.charAt(0).toUpperCase() + risk.status.slice(1)
      ])
    })
    const risksWS = XLSX.utils.aoa_to_sheet(risksData)

    // Apply styles to Risk Register sheet
    // Title
    if (risksWS['A1']) applyTitleStyle(risksWS['A1'])

    // Headers
    const riskHeaders = ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3', 'I3', 'J3', 'K3', 'L3', 'M3']
    riskHeaders.forEach(cell => {
      if (risksWS[cell]) applyHeaderStyle(risksWS[cell])
    })

    // Data rows with conditional formatting for risk levels
    for (let i = 4; i <= 3 + sortedRisks.length; i++) {
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].forEach(col => {
        if (risksWS[`${col}${i}`]) {
          applyDataStyle(risksWS[`${col}${i}`])

          // Apply conditional colors to Risk Level column (I)
          if (col === 'I' && risksWS[`${col}${i}`].v) {
            const riskLevel = risksWS[`${col}${i}`].v.toString().toLowerCase()
            if (riskLevel.includes('very high')) {
              risksWS[`${col}${i}`].s.fill = { fgColor: { rgb: 'FEE2E2' } }
              risksWS[`${col}${i}`].s.font = { ...risksWS[`${col}${i}`].s.font, color: { rgb: '991B1B' }, bold: true }
            } else if (riskLevel.includes('high')) {
              risksWS[`${col}${i}`].s.fill = { fgColor: { rgb: 'FED7AA' } }
              risksWS[`${col}${i}`].s.font = { ...risksWS[`${col}${i}`].s.font, color: { rgb: '9A3412' }, bold: true }
            } else if (riskLevel.includes('medium')) {
              risksWS[`${col}${i}`].s.fill = { fgColor: { rgb: 'FEF3C7' } }
              risksWS[`${col}${i}`].s.font = { ...risksWS[`${col}${i}`].s.font, color: { rgb: '78350F' }, bold: true }
            } else if (riskLevel.includes('low')) {
              risksWS[`${col}${i}`].s.fill = { fgColor: { rgb: 'DBEAFE' } }
              risksWS[`${col}${i}`].s.font = { ...risksWS[`${col}${i}`].s.font, color: { rgb: '1E3A8A' }, bold: true }
            }
          }
        }
      })
    }

    // Set column widths for Risk Register
    risksWS['!cols'] = [
      { wch: 12 },  // Risk ID
      { wch: 20 },  // Asset
      { wch: 25 },  // Threat
      { wch: 25 },  // Vulnerability
      { wch: 30 },  // Existing Controls
      { wch: 12 },  // Likelihood
      { wch: 12 },  // Impact
      { wch: 10 },  // Risk Score
      { wch: 15 },  // Risk Level
      { wch: 12 },  // Treatment
      { wch: 20 },  // Owner
      { wch: 15 },  // Review Date
      { wch: 12 }   // Status
    ]

    // Merge title
    risksWS['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 12 } }]

    XLSX.utils.book_append_sheet(wb, risksWS, 'Risk Register')

    // Threats & Vulnerabilities Sheet
    const threatsVulnData = [
      ['THREATS AND VULNERABILITIES'],
      [''],
      ['THREATS'],
      [''],
      ['Threat ID', 'Threat Name', 'Type', 'Source', 'Description']
    ]

    riskData.threats.forEach(threat => {
      threatsVulnData.push([
        threat.id,
        threat.name,
        threat.type.charAt(0).toUpperCase() + threat.type.slice(1),
        threat.source,
        threat.description
      ])
    })

    threatsVulnData.push([''])
    threatsVulnData.push(['VULNERABILITIES'])
    threatsVulnData.push([''])
    threatsVulnData.push(['Vulnerability ID', 'Vulnerability Name', 'Associated Asset', 'Severity', 'Description'])

    riskData.vulnerabilities.forEach(vuln => {
      const asset = riskData.assets.find(a => a.id === vuln.assetId)
      threatsVulnData.push([
        vuln.id,
        vuln.name,
        asset?.name || 'Unknown',
        vuln.severity.charAt(0).toUpperCase() + vuln.severity.slice(1),
        vuln.description
      ])
    })

    const threatsVulnWS = XLSX.utils.aoa_to_sheet(threatsVulnData)

    // Apply styles to Threats & Vulnerabilities sheet
    // Title
    if (threatsVulnWS['A1']) applyTitleStyle(threatsVulnWS['A1'])

    // Threats section header
    if (threatsVulnWS['A3']) applySectionStyle(threatsVulnWS['A3'])

    // Threats headers
    const threatsHeaderRow = 5
    ['A', 'B', 'C', 'D', 'E'].forEach(col => {
      if (threatsVulnWS[`${col}${threatsHeaderRow}`]) applyHeaderStyle(threatsVulnWS[`${col}${threatsHeaderRow}`])
    })

    // Threats data
    for (let i = 6; i <= 5 + riskData.threats.length; i++) {
      ['A', 'B', 'C', 'D', 'E'].forEach(col => {
        if (threatsVulnWS[`${col}${i}`]) applyDataStyle(threatsVulnWS[`${col}${i}`])
      })
    }

    // Vulnerabilities section header
    const vulnHeaderRow = 5 + riskData.threats.length + 2
    if (threatsVulnWS[`A${vulnHeaderRow}`]) applySectionStyle(threatsVulnWS[`A${vulnHeaderRow}`])

    // Vulnerabilities headers
    const vulnDataHeaderRow = vulnHeaderRow + 2
    ['A', 'B', 'C', 'D', 'E'].forEach(col => {
      if (threatsVulnWS[`${col}${vulnDataHeaderRow}`]) applyHeaderStyle(threatsVulnWS[`${col}${vulnDataHeaderRow}`])
    })

    // Vulnerabilities data
    for (let i = vulnDataHeaderRow + 1; i <= vulnDataHeaderRow + riskData.vulnerabilities.length; i++) {
      ['A', 'B', 'C', 'D', 'E'].forEach(col => {
        if (threatsVulnWS[`${col}${i}`]) applyDataStyle(threatsVulnWS[`${col}${i}`])
      })
    }

    threatsVulnWS['!cols'] = [
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 50 }
    ]

    // Merge title and section headers
    threatsVulnWS['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
      { s: { r: vulnHeaderRow - 1, c: 0 }, e: { r: vulnHeaderRow - 1, c: 4 } }
    ]

    XLSX.utils.book_append_sheet(wb, threatsVulnWS, 'Threats & Vulnerabilities')

    // Risk Matrix Sheet
    const matrixData = [
      ['RISK ASSESSMENT MATRIX (ISO 27001:2022)'],
      [''],
      ['', '', 'IMPACT →', '', '', '', ''],
      ['', '', 'Very Low (1)', 'Low (2)', 'Medium (3)', 'High (4)', 'Very High (5)'],
      ['LIKELIHOOD', 'Very High (5)']
    ]

    const likelihoodLevels = ['very-high', 'high', 'medium', 'low', 'very-low']
    const impactLevels = ['very-low', 'low', 'medium', 'high', 'very-high']
    const likelihoodLabels = { 'very-high': 'Very High (5)', 'high': 'High (4)', 'medium': 'Medium (3)', 'low': 'Low (2)', 'very-low': 'Very Low (1)' }

    likelihoodLevels.forEach((likelihood, idx) => {
      const row = idx === 0 ? ['↓', likelihoodLabels[likelihood]] : ['', likelihoodLabels[likelihood]]
      impactLevels.forEach(impact => {
        const riskLevel = calculateRiskLevel(likelihood, impact)
        const likelihoodValues = { 'very-low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very-high': 5 }
        const impactValues = { 'very-low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very-high': 5 }
        const score = likelihoodValues[likelihood as keyof typeof likelihoodValues] * impactValues[impact as keyof typeof impactValues]
        row.push(`${riskLevel.replace('-', ' ').toUpperCase()} (${score})`)
      })
      matrixData.push(row)
    })

    matrixData.push([''])
    matrixData.push(['RISK LEVEL LEGEND'])
    matrixData.push(['Score Range', 'Risk Level', 'Action Required'])
    matrixData.push(['20-25', 'VERY HIGH', 'Immediate action required'])
    matrixData.push(['10-19', 'HIGH', 'Senior management attention needed'])
    matrixData.push(['5-9', 'MEDIUM', 'Management responsibility specified'])
    matrixData.push(['3-4', 'LOW', 'Manage by routine procedures'])
    matrixData.push(['1-2', 'VERY LOW', 'Accept and monitor'])

    const matrixWS = XLSX.utils.aoa_to_sheet(matrixData)

    // Apply styles to Risk Matrix sheet
    // Title
    if (matrixWS['A1']) applyTitleStyle(matrixWS['A1'])

    // Impact header row
    ['C3', 'D3', 'E3', 'F3', 'G3'].forEach(cell => {
      if (matrixWS[cell]) applyHeaderStyle(matrixWS[cell])
    })

    // Column headers row
    ['C4', 'D4', 'E4', 'F4', 'G4'].forEach(cell => {
      if (matrixWS[cell]) applyHeaderStyle(matrixWS[cell])
    })

    // Row headers (Likelihood labels)
    ['A5', 'B5', 'B6', 'B7', 'B8', 'B9'].forEach(cell => {
      if (matrixWS[cell]) {
        matrixWS[cell].s = {
          font: { bold: true, sz: 11 },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle }
        }
      }
    })

    // Matrix data cells with colors
    for (let row = 5; row <= 9; row++) {
      for (let colNum = 2; colNum <= 6; colNum++) {
        const col = String.fromCharCode(65 + colNum) // C-G
        const cell = `${col}${row}`
        if (matrixWS[cell]) {
          applyDataStyle(matrixWS[cell])
          const cellValue = matrixWS[cell].v?.toString().toLowerCase() || ''

          // Color code based on risk level
          if (cellValue.includes('very high')) {
            matrixWS[cell].s.fill = { fgColor: { rgb: 'FEE2E2' } }
            matrixWS[cell].s.font = { ...matrixWS[cell].s.font, color: { rgb: '991B1B' }, bold: true }
          } else if (cellValue.includes('high')) {
            matrixWS[cell].s.fill = { fgColor: { rgb: 'FED7AA' } }
            matrixWS[cell].s.font = { ...matrixWS[cell].s.font, color: { rgb: '9A3412' }, bold: true }
          } else if (cellValue.includes('medium')) {
            matrixWS[cell].s.fill = { fgColor: { rgb: 'FEF3C7' } }
            matrixWS[cell].s.font = { ...matrixWS[cell].s.font, color: { rgb: '78350F' }, bold: true }
          } else if (cellValue.includes('low')) {
            matrixWS[cell].s.fill = { fgColor: { rgb: 'DBEAFE' } }
            matrixWS[cell].s.font = { ...matrixWS[cell].s.font, color: { rgb: '1E3A8A' }, bold: true }
          }
        }
      }
    }

    // Legend section
    const legendStartRow = 11
    if (matrixWS[`A${legendStartRow}`]) applySectionStyle(matrixWS[`A${legendStartRow}`])

    // Legend headers
    ['A12', 'B12', 'C12'].forEach(cell => {
      if (matrixWS[cell]) applyHeaderStyle(matrixWS[cell])
    })

    // Legend data
    for (let i = 13; i <= 17; i++) {
      ['A', 'B', 'C'].forEach(col => {
        if (matrixWS[`${col}${i}`]) applyDataStyle(matrixWS[`${col}${i}`])
      })
    }

    matrixWS['!cols'] = [
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 }
    ]

    // Merge cells
    matrixWS['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } },
      { s: { r: 2, c: 2 }, e: { r: 2, c: 6 } },
      { s: { r: 10, c: 0 }, e: { r: 10, c: 2 } }
    ]

    XLSX.utils.book_append_sheet(wb, matrixWS, 'Risk Matrix')

    // Risk Criteria Sheet
    const criteriaData = [
      ['RISK ASSESSMENT CRITERIA (ISO 27001:2022)'],
      [''],
      ['LIKELIHOOD SCALE'],
      [''],
      ['Level', 'Score', 'Probability', 'Description', 'Example'],
      ['Very High', '5', '> 75%', 'Almost certain to occur', 'Occurs monthly or more frequently'],
      ['High', '4', '51-75%', 'Likely to occur', 'Occurs quarterly'],
      ['Medium', '3', '26-50%', 'Possible', 'Occurs annually'],
      ['Low', '2', '5-25%', 'Unlikely but possible', 'Occurs every few years'],
      ['Very Low', '1', '< 5%', 'Rare', 'May occur once in 5+ years'],
      [''],
      ['IMPACT SCALE'],
      [''],
      ['Level', 'Score', 'Financial', 'Operational', 'Reputational'],
      ['Very High', '5', '> $1M loss', 'Critical system failure > 7 days', 'National media coverage'],
      ['High', '4', '$500K-$1M', 'Major disruption 3-7 days', 'Significant negative publicity'],
      ['Medium', '3', '$100K-$500K', 'Moderate disruption 1-3 days', 'Local media attention'],
      ['Low', '2', '$10K-$100K', 'Minor disruption < 1 day', 'Limited negative impact'],
      ['Very Low', '1', '< $10K', 'Negligible disruption', 'No public awareness'],
      [''],
      ['RISK CALCULATION'],
      [''],
      ['Risk Score = Likelihood × Impact'],
      ['Example: High Likelihood (4) × High Impact (4) = Risk Score of 16 (HIGH RISK)']
    ]
    const criteriaWS = XLSX.utils.aoa_to_sheet(criteriaData)

    // Apply styles to Risk Criteria sheet
    // Title
    if (criteriaWS['A1']) applyTitleStyle(criteriaWS['A1'])

    // Likelihood Scale section header
    if (criteriaWS['A3']) applySectionStyle(criteriaWS['A3'])

    // Likelihood Scale headers
    ['A5', 'B5', 'C5', 'D5', 'E5'].forEach(cell => {
      if (criteriaWS[cell]) applyHeaderStyle(criteriaWS[cell])
    })

    // Likelihood Scale data
    for (let i = 6; i <= 10; i++) {
      ['A', 'B', 'C', 'D', 'E'].forEach(col => {
        if (criteriaWS[`${col}${i}`]) applyDataStyle(criteriaWS[`${col}${i}`])
      })
    }

    // Impact Scale section header
    if (criteriaWS['A12']) applySectionStyle(criteriaWS['A12'])

    // Impact Scale headers
    ['A14', 'B14', 'C14', 'D14', 'E14'].forEach(cell => {
      if (criteriaWS[cell]) applyHeaderStyle(criteriaWS[cell])
    })

    // Impact Scale data
    for (let i = 15; i <= 19; i++) {
      ['A', 'B', 'C', 'D', 'E'].forEach(col => {
        if (criteriaWS[`${col}${i}`]) applyDataStyle(criteriaWS[`${col}${i}`])
      })
    }

    // Risk Calculation section header
    if (criteriaWS['A21']) applySectionStyle(criteriaWS['A21'])

    // Risk Calculation content
    if (criteriaWS['A23']) {
      criteriaWS['A23'].s = {
        font: { bold: true, sz: 11, color: { rgb: '1E3A8A' } },
        alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
        border: { top: borderStyle, bottom: borderStyle, left: borderStyle, right: borderStyle }
      }
    }
    if (criteriaWS['A24']) {
      applyDataStyle(criteriaWS['A24'])
      criteriaWS['A24'].s.font = { italic: true }
    }

    criteriaWS['!cols'] = [
      { wch: 15 },
      { wch: 10 },
      { wch: 20 },
      { wch: 35 },
      { wch: 35 }
    ]

    // Merge cells
    criteriaWS['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } },
      { s: { r: 11, c: 0 }, e: { r: 11, c: 4 } },
      { s: { r: 20, c: 0 }, e: { r: 20, c: 4 } },
      { s: { r: 22, c: 0 }, e: { r: 22, c: 4 } },
      { s: { r: 23, c: 0 }, e: { r: 23, c: 4 } }
    ]

    XLSX.utils.book_append_sheet(wb, criteriaWS, 'Risk Criteria')

      // Download the file
      const fileName = riskData.organizationName
        ? `${riskData.organizationName.replace(/\s+/g, '-').toLowerCase()}-risk-register.xlsx`
        : 'risk-register.xlsx'

      XLSX.writeFile(wb, fileName)
    } catch (error) {
      console.error('Failed to export Excel file:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to export Excel file'
      setError(`Excel Export Error: ${errorMessage}`)
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'very-high': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'very-low': return 'bg-green-50 text-green-700 border-green-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Assessment Setup</h4>
              <p className="text-blue-800 text-sm">
                Define the scope, methodology, and basic parameters for your risk assessment. This will guide the entire assessment process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                <input
                  type="text"
                  value={riskData.organizationName}
                  onChange={(e) => {
                    const sanitized = sanitizeInput(e.target.value, 100)
                    setRiskData(prev => ({ ...prev, organizationName: sanitized }))
                    setHasUnsavedChanges(true)
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter organization name"
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Date</label>
                <input
                  type="date"
                  value={riskData.assessmentDate}
                  onChange={(e) => setRiskData(prev => ({ ...prev, assessmentDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assessor</label>
                <input
                  type="text"
                  value={riskData.assessor}
                  onChange={(e) => {
                    const sanitized = sanitizeInput(e.target.value, 100)
                    setRiskData(prev => ({ ...prev, assessor: sanitized }))
                    setHasUnsavedChanges(true)
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter assessor name/team"
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Methodology</label>
                <select
                  value={riskData.methodology}
                  onChange={(e) => setRiskData(prev => ({ ...prev, methodology: e.target.value as RiskMethodology }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="qualitative">Qualitative</option>
                  <option value="quantitative">Quantitative</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Scope</label>
              <textarea
                value={riskData.scope}
                onChange={(e) => {
                  const sanitized = sanitizeInput(e.target.value, 1000)
                  setRiskData(prev => ({ ...prev, scope: sanitized }))
                  setHasUnsavedChanges(true)
                }}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Define the scope of your risk assessment..."
                maxLength={1000}
                required
              />
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" role="alert" aria-label="Asset identification instructions">
              <h4 className="font-medium text-blue-900 mb-2">Asset Identification</h4>
              <p className="text-blue-800 text-sm">
                Identify and classify all information assets within your ISMS scope. Include information, physical, software, and human assets.
              </p>
            </div>

            {/* Current Assets */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Identified Assets ({riskData.assets.length})</h4>
              <div className="space-y-3">
                {riskData.assets.map((asset) => {
                  const isCustomAsset = !predefinedAssets.some(pa => pa.name === asset.name)
                  return (
                    <div key={asset.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium text-gray-900">{asset.name}</h5>
                            {isCustomAsset && (
                              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                Custom
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{asset.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {asset.type}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getRiskLevelColor(asset.classification)}`}>
                              {asset.classification}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getRiskLevelColor(asset.value)}`}>
                              {asset.value} value
                            </span>
                            <span className="text-xs text-gray-500">
                              Owner: {asset.owner}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeAsset(asset.id)}
                          className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
                {riskData.assets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No assets identified yet. Select from common assets below to get started.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add Predefined Assets */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Common Assets Library ({predefinedAssets.length} available)</h4>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500">
                    {riskData.assets.filter(asset => predefinedAssets.some(pa => pa.name === asset.name)).length} selected
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const filteredAssets = assetFilter === 'all' ? predefinedAssets : predefinedAssets.filter(a => a.type === assetFilter)
                        const searchFiltered = assetSearchTerm
                          ? filteredAssets.filter(a => a.name.toLowerCase().includes(assetSearchTerm.toLowerCase()))
                          : filteredAssets
                        searchFiltered.forEach(asset => {
                          if (!riskData.assets.some(a => a.name === asset.name)) {
                            togglePredefinedAsset(asset)
                          }
                        })
                      }}
                      className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Select All Filtered
                    </button>
                    <button
                      onClick={() => {
                        const filteredAssets = assetFilter === 'all' ? predefinedAssets : predefinedAssets.filter(a => a.type === assetFilter)
                        const searchFiltered = assetSearchTerm
                          ? filteredAssets.filter(a => a.name.toLowerCase().includes(assetSearchTerm.toLowerCase()))
                          : filteredAssets
                        searchFiltered.forEach(asset => {
                          const existingAsset = riskData.assets.find(a => a.name === asset.name)
                          if (existingAsset) {
                            removeAsset(existingAsset.id)
                          }
                        })
                      }}
                      className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                      Clear All Filtered
                    </button>
                  </div>
                </div>
              </div>

              {/* Search and Filter Controls */}
              <div className="space-y-4 mb-4">
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search assets by name..."
                    value={assetSearchTerm}
                    onChange={(e) => setAssetSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Search assets by name"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  {assetSearchTerm && (
                    <button
                      onClick={() => setAssetSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Asset Type Filters */}
                <div className="flex flex-wrap gap-2">
                  {(['all', 'information', 'software', 'physical', 'human'] as const).map(type => {
                    const typeCount = predefinedAssets.filter(a => type === 'all' || a.type === type).length
                    const filteredCount = assetSearchTerm
                      ? predefinedAssets.filter(a =>
                          (type === 'all' || a.type === type) &&
                          a.name.toLowerCase().includes(assetSearchTerm.toLowerCase())
                        ).length
                      : typeCount

                    return (
                      <button
                        key={type}
                        onClick={() => setAssetFilter(type)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          assetFilter === type
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                        <span className="ml-1 text-xs opacity-75">
                          ({assetSearchTerm ? `${filteredCount}/${typeCount}` : typeCount})
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
                {predefinedAssets
                  .filter(asset => assetFilter === 'all' || asset.type === assetFilter)
                  .filter(asset => !assetSearchTerm || asset.name.toLowerCase().includes(assetSearchTerm.toLowerCase()))
                  .map((asset, index) => {
                  const isSelected = riskData.assets.some(a => a.name === asset.name)
                  return (
                    <button
                      key={index}
                      onClick={() => togglePredefinedAsset(asset)}
                      className={`text-left p-3 rounded-lg border text-sm transition-colors ${
                        isSelected
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{asset.name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {asset.type}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getRiskLevelColor(asset.classification)}`}>
                              {asset.classification}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${getRiskLevelColor(asset.value)}`}>
                              {asset.value}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="ml-2 flex-shrink-0">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Custom Asset Creation */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Add Custom Asset</h4>
                <button
                  onClick={() => setShowCustomAssetForm(!showCustomAssetForm)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{showCustomAssetForm ? 'Cancel' : 'Create Asset'}</span>
                </button>
              </div>

              {showCustomAssetForm && (
                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asset Name *</label>
                      <input
                        type="text"
                        value={customAsset.name}
                        onChange={(e) => {
                          const sanitized = sanitizeInput(e.target.value, 100)
                          setCustomAsset(prev => ({ ...prev, name: sanitized }))
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Customer Portal Database"
                        maxLength={100}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Asset Type *</label>
                      <select
                        value={customAsset.type}
                        onChange={(e) => setCustomAsset(prev => ({ ...prev, type: e.target.value as AssetType }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="information">Information</option>
                        <option value="software">Software</option>
                        <option value="physical">Physical</option>
                        <option value="human">Human</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Owner *</label>
                      <input
                        type="text"
                        value={customAsset.owner}
                        onChange={(e) => {
                          const sanitized = sanitizeInput(e.target.value, 100)
                          setCustomAsset(prev => ({ ...prev, owner: sanitized }))
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., IT Department"
                        maxLength={100}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Classification *</label>
                      <select
                        value={customAsset.classification}
                        onChange={(e) => setCustomAsset(prev => ({ ...prev, classification: e.target.value as ClassificationLevel }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="public">Public</option>
                        <option value="internal">Internal</option>
                        <option value="confidential">Confidential</option>
                        <option value="restricted">Restricted</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Business Value *</label>
                      <select
                        value={customAsset.value}
                        onChange={(e) => setCustomAsset(prev => ({ ...prev, value: e.target.value as ValueLevel }))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                      <textarea
                        value={customAsset.description}
                        onChange={(e) => {
                          const sanitized = sanitizeInput(e.target.value, 500)
                          setCustomAsset(prev => ({ ...prev, description: sanitized }))
                        }}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe the asset, its purpose, and any relevant details..."
                        maxLength={500}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 gap-4">
                    <div className="text-sm text-gray-500">
                      * Required fields
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setShowCustomAssetForm(false)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addCustomAsset}
                        disabled={!customAsset.name.trim() || !customAsset.description.trim() || !customAsset.owner.trim()}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add Asset
                      </button>
                    </div>
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
              <h4 className="font-medium text-blue-900 mb-2">Risk Analysis</h4>
              <p className="text-blue-800 text-sm">
                For each asset, select relevant threats and assess likelihood and impact to determine risk levels.
              </p>
            </div>

            {/* Asset-based Risk Assessment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Asset Selection */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Select Asset for Risk Analysis</h4>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {riskData.assets.map((asset) => {
                    const assetRisks = riskData.risks.filter(r => r.assetId === asset.id)
                    return (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAssetForRisk(asset.id)}
                        className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                          selectedAssetForRisk === asset.id
                            ? 'bg-blue-50 border-blue-200 text-blue-800'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{asset.name}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {asset.type} • {asset.classification} • {asset.value} value
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {assetRisks.length > 0 && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {assetRisks.length} risk{assetRisks.length !== 1 ? 's' : ''}
                              </span>
                            )}
                            {selectedAssetForRisk === asset.id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
                {riskData.assets.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No assets available. Please add assets in the previous steps.</p>
                  </div>
                )}
              </div>

              {/* Risk Assessment Form */}
              <div>
                {selectedAssetForRisk ? (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium text-gray-900">
                        Assess Risk for: {riskData.assets.find(a => a.id === selectedAssetForRisk)?.name}
                      </h4>
                      <button
                        onClick={() => setSelectedAssetForRisk(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Threat *</label>
                        <select
                          value={newRisk.threatId}
                          onChange={(e) => {
                            setNewRisk(prev => ({
                              ...prev,
                              threatId: e.target.value,
                              vulnerabilityId: '' // Clear vulnerability when threat changes
                            }))
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Choose a threat...</option>
                          {(() => {
                            const selectedAsset = riskData.assets.find(a => a.id === selectedAssetForRisk)
                            if (!selectedAsset) return []

                            ensureThreatsAndVulnerabilitiesExist(selectedAsset.name)
                            const relevantThreats = getAssetThreats(selectedAsset.name)

                            return relevantThreats.map((threat) => (
                              <option key={threat.id} value={threat.id}>
                                {threat.name} ({threat.type})
                              </option>
                            ))
                          })()}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Vulnerability *</label>
                        <select
                          value={newRisk.vulnerabilityId}
                          onChange={(e) => setNewRisk(prev => ({ ...prev, vulnerabilityId: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Choose a vulnerability...</option>
                          {(() => {
                            const selectedAsset = riskData.assets.find(a => a.id === selectedAssetForRisk)
                            if (!selectedAsset) return []

                            let relevantVulns = getAssetVulnerabilities(selectedAsset.name)

                            // Filter vulnerabilities based on selected threat
                            if (newRisk.threatId) {
                              const selectedThreat = getAssetThreats(selectedAsset.name).find(t => t.id === newRisk.threatId)
                              if (selectedThreat && threatToVulnerabilityMapping[selectedThreat.name]) {
                                relevantVulns = relevantVulns.filter(vuln =>
                                  threatToVulnerabilityMapping[selectedThreat.name].includes(vuln.name)
                                )
                              }
                            }

                            return relevantVulns.map((vuln) => (
                              <option key={vuln.id} value={vuln.id}>
                                {vuln.name} ({vuln.severity})
                              </option>
                            ))
                          })()}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Likelihood *</label>
                          <select
                            value={newRisk.likelihood}
                            onChange={(e) => setNewRisk(prev => ({ ...prev, likelihood: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="very-low">Very Low (&lt; 1%)</option>
                            <option value="low">Low (1-25%)</option>
                            <option value="medium">Medium (26-50%)</option>
                            <option value="high">High (51-75%)</option>
                            <option value="very-high">Very High (&gt; 75%)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Impact *</label>
                          <select
                            value={newRisk.impact}
                            onChange={(e) => setNewRisk(prev => ({ ...prev, impact: e.target.value }))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="very-low">Very Low</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="very-high">Very High</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
                        <div className={`p-3 rounded-lg text-center font-medium ${
                          getRiskLevelColor(calculateRiskLevel(newRisk.likelihood, newRisk.impact))
                        }`}>
                          {calculateRiskLevel(newRisk.likelihood, newRisk.impact).replace('-', ' ').toUpperCase()}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Risk Owner</label>
                        <input
                          type="text"
                          value={newRisk.owner}
                          onChange={(e) => setNewRisk(prev => ({ ...prev, owner: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Security Team"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Review Date</label>
                        <input
                          type="date"
                          value={newRisk.reviewDate}
                          onChange={(e) => setNewRisk(prev => ({ ...prev, reviewDate: e.target.value }))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Existing Controls
                          <span className="text-gray-500 text-xs ml-2">(one per line)</span>
                        </label>
                        <textarea
                          value={newRisk.controls.join('\n')}
                          onChange={(e) => {
                            const controlsArray = e.target.value
                              .split('\n')
                              .map(c => c.trim())
                              .filter(c => c.length > 0)
                            setNewRisk(prev => ({ ...prev, controls: controlsArray }))
                          }}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g.,&#10;Firewall protection&#10;Access control policies&#10;Regular security audits"
                          rows={4}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter existing security controls that are currently in place for this asset
                        </p>
                      </div>

                      <button
                        onClick={addAssetThreatRisk}
                        disabled={!newRisk.threatId || !newRisk.vulnerabilityId}
                        className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Add Risk & Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Select an Asset</h4>
                    <p className="text-gray-600">
                      Choose an asset from the left to start assessing risks.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Current Risks Summary */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment Summary ({riskData.risks.length})</h4>
              <div className="space-y-3">
                {riskData.risks.map((risk) => {
                  const asset = riskData.assets.find(a => a.id === risk.assetId)
                  const threat = riskData.threats.find(t => t.id === risk.threatId)
                  return (
                    <div key={risk.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">
                            {asset?.name} → {threat?.name}
                          </h5>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Likelihood: {risk.likelihood.replace('-', ' ')}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              Impact: {risk.impact.replace('-', ' ')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${getRiskLevelColor(risk.riskLevel)}`}>
                              Risk: {risk.riskLevel.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              Owner: {risk.owner}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setRiskData(prev => ({
                              ...prev,
                              risks: prev.risks.filter(r => r.id !== risk.id)
                            }))
                          }}
                          className="ml-4 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove risk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
                {riskData.risks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No risks assessed yet. Select assets and threats to begin risk analysis.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Matrix Reference */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Risk Matrix Reference</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2 bg-gray-50 text-xs">Impact →<br/>Likelihood ↓</th>
                      <th className="border border-gray-300 p-2 bg-green-50 text-xs">Very Low</th>
                      <th className="border border-gray-300 p-2 bg-blue-50 text-xs">Low</th>
                      <th className="border border-gray-300 p-2 bg-yellow-50 text-xs">Medium</th>
                      <th className="border border-gray-300 p-2 bg-red-50 text-xs">High</th>
                      <th className="border border-gray-300 p-2 bg-red-100 text-xs">Very High</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Very High', 'High', 'Medium', 'Low', 'Very Low'].map((likelihood) => (
                      <tr key={likelihood}>
                        <td className="border border-gray-300 p-2 bg-gray-50 font-medium text-xs">{likelihood}</td>
                        {['Very Low', 'Low', 'Medium', 'High', 'Very High'].map((impact) => {
                          const riskLevel = calculateRiskLevel(likelihood.toLowerCase().replace(' ', '-'), impact.toLowerCase().replace(' ', '-'))
                          return (
                            <td key={impact} className={`border border-gray-300 p-2 text-xs ${getRiskLevelColor(riskLevel)}`}>
                              {riskLevel.replace('-', ' ').toUpperCase()}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Risk Treatment</h4>
              <p className="text-blue-800 text-sm">
                Define treatment strategies for identified risks and document the complete risk register.
              </p>
            </div>

            {/* Risk Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['very-high', 'high', 'medium', 'low'].map(level => {
                const count = riskData.risks.filter(r => r.riskLevel === level).length
                return (
                  <div key={level} className={`p-4 rounded-lg border ${getRiskLevelColor(level)}`}>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm capitalize">{level.replace('-', ' ')} Risk{count !== 1 ? 's' : ''}</div>
                  </div>
                )
              })}
            </div>

            {/* Complete Risk Register */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Complete Risk Register</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const content = generateRiskRegister()
                      setGeneratedDocument(content)
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <FileDown className="w-4 h-4" />
                    <span>Generate Register</span>
                  </button>
                  {generatedDocument && (
                    <>
                      <button
                        onClick={downloadRiskRegister}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Download MD</span>
                      </button>
                      <button
                        onClick={downloadRiskRegisterExcel}
                        className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                      >
                        <FileDown className="w-4 h-4" />
                        <span>Download Excel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {generatedDocument && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">✓ Risk Register Generated</h5>
                  <p className="text-gray-600 text-sm">
                    Your comprehensive risk register has been generated with {riskData.assets.length} assets,
                    {' '}{riskData.threats.length} threats, {riskData.vulnerabilities.length} vulnerabilities,
                    and {riskData.risks.length} analyzed risks.
                  </p>
                </div>
              )}
            </div>

            {/* Treatment Summary */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Risk Treatment Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['accept', 'avoid', 'mitigate', 'transfer'].map(treatment => {
                  const count = riskData.risks.filter(r => r.treatment === treatment).length
                  return (
                    <div key={treatment} className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-xl font-bold text-gray-900">{count}</div>
                      <div className="text-sm text-gray-600 capitalize">{treatment}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Next Steps</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Review and validate all identified risks with stakeholders</li>
                <li>• Implement selected controls for risk mitigation</li>
                <li>• Establish monitoring and review procedures</li>
                <li>• Schedule regular risk assessment updates</li>
                <li>• Proceed to Risk Treatment Planning (next ISMS step)</li>
              </ul>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="h-full bg-white" role="main" aria-label="Risk Assessment Wizard">
      {/* Notifications */}
      {(error || successMessage) && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg mb-2 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg mb-2 flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">Success</p>
                <p className="text-sm">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-green-600 hover:text-green-800"
                aria-label="Dismiss success message"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Risk Assessment</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Identify, analyze, and evaluate information security risks</p>
            {lastSaved && (
              <p className="text-xs text-green-600 mt-1">
                Last saved: {lastSaved.toLocaleString()}
              </p>
            )}
            {hasUnsavedChanges && (
              <p className="text-xs text-amber-600 mt-1">
                • Unsaved changes (auto-save every 30s)
              </p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            {/* Save/Load Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => saveToStorage(riskData, false)}
                className="flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors min-w-0 flex-1 sm:flex-initial"
                title="Save current progress"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save Progress</span>
                <span className="sm:hidden">Save</span>
              </button>

              <button
                onClick={() => {
                  const name = prompt('Enter a name for this assessment:')
                  if (name) saveAssessmentWithName(name)
                }}
                className="flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors min-w-0 flex-1 sm:flex-initial"
                title="Save assessment with custom name"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Save As</span>
                <span className="sm:hidden">As</span>
              </button>

              <button
                onClick={() => setShowLoadDialog(true)}
                className="flex items-center justify-center space-x-1 px-3 py-2 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors min-w-0 flex-1 sm:flex-initial"
                title="Load saved assessment"
                aria-label="Load saved risk assessment"
              >
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Load</span>
              </button>

              <button
                onClick={exportAssessmentData}
                className="flex items-center space-x-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                title="Export assessment data"
                aria-label="Export risk assessment data as JSON"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Export</span>
              </button>

              <label className="flex items-center space-x-1 px-3 py-2 text-sm bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors cursor-pointer"
                     title="Import assessment data"
                     aria-label="Import risk assessment data from JSON file">
                <Upload className="w-4 h-4" aria-hidden="true" />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={importAssessmentData}
                  className="hidden"
                  aria-label="Select JSON file to import"
                />
              </label>
            </div>

            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 sm:mb-0">{steps[currentStep].title}</h2>
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="hidden sm:flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const validation = validateStep(index)
            const status = getStepCompletionStatus(index)
            const isActive = index === currentStep

            return (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                  status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                  status === 'in-progress' ? (validation.isValid ? 'bg-blue-500 border-blue-500 text-white' : 'bg-red-500 border-red-500 text-white') :
                  'bg-gray-200 border-gray-300 text-gray-500'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : status === 'in-progress' ? (
                    validation.isValid ? (
                      <span className="text-xs font-medium">{index + 1}</span>
                    ) : (
                      <AlertTriangle className="w-4 h-4" />
                    )
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <div className={`text-xs mt-2 text-center max-w-20 ${
                  isActive ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}>
                  {step.title.replace(' & ', ' & ')}
                </div>
                {index < steps.length - 1 && (
                  <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${
                    status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                  }`} style={{ transform: 'translateX(50%)', width: '100%' }} />
                )}
              </div>
            )
          })}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm">{steps[currentStep].description}</p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go to previous step"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => saveToStorage(riskData, false)}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save current progress"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <Save className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Progress'}</span>
            </button>

            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Go to next step"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="load-dialog-title">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full m-4">
            <div className="p-6">
              <h3 id="load-dialog-title" className="text-lg font-semibold text-gray-900 mb-4">Load Saved Assessment</h3>

              {savedAssessments.length === 0 ? (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No saved assessments found</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedAssessments.map((assessment) => (
                    <button
                      key={assessment.id}
                      onClick={() => loadAssessment(assessment.id)}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{assessment.name}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(assessment.date).toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowLoadDialog(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-red-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const RiskAssessmentWithErrorBoundary = ({ scopeData }: { scopeData: ScopeData }) => (
  <ErrorBoundary>
    <RiskAssessment scopeData={scopeData} />
  </ErrorBoundary>
)

export default RiskAssessmentWithErrorBoundary