import React, { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertTriangle, FileText, Download, Plus, X, Edit2 } from 'lucide-react'

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

interface Risk {
  id: string
  assetId: string
  assetName: string
  threatId: string
  threatName: string
  vulnerabilityId: string
  vulnerabilityName: string
  likelihood: string
  impact: string
  riskLevel: string
  riskScore: number
  description: string
  currentControls: string
}

interface Control {
  id: string
  name: string
  category: string
  description: string
  iso27001Reference: string
  implementationGuidance: string
  cost: 'Low' | 'Medium' | 'High'
  complexity: 'Low' | 'Medium' | 'High'
  timeframe: 'Immediate' | 'Short-term' | 'Long-term'
}

interface Treatment {
  id: string
  riskId: string
  strategy: 'mitigate' | 'accept' | 'transfer' | 'avoid'
  selectedControls: string[]
  residualRiskLevel: string
  residualRiskScore: number
  justification: string
  owner: string
  deadline: string
  status: 'planned' | 'in-progress' | 'completed' | 'overdue'
  cost: number
  notes: string
}

interface RiskTreatmentProps {
  scopeData: ScopeData | null
}

// Intelligent control recommendations based on threats and vulnerabilities (ISO 27001:2022)
const threatVulnerabilityControlMapping: Record<string, Record<string, string[]>> = {
  'SQL Injection Attack': {
    'Unvalidated Input': ['A.8.23', 'A.8.28', 'A.8.29', 'A.5.18'],
    'Weak Database Encryption': ['A.8.24', 'A.8.23', 'A.5.18'],
    'Insufficient Access Controls': ['A.5.15', 'A.5.18', 'A.8.2'],
    'Missing Security Patches': ['A.8.8', 'A.8.28', 'A.5.24']
  },
  'Malware Attack': {
    'Missing Security Patches': ['A.8.8', 'A.5.24', 'A.8.7'],
    'Outdated Software': ['A.8.8', 'A.8.28', 'A.8.1'],
    'Weak Email Security': ['A.8.15', 'A.6.3', 'A.8.7'],
    'Insufficient Endpoint Protection': ['A.8.7', 'A.8.1', 'A.8.20']
  },
  'Phishing Attack': {
    'Lack of User Training': ['A.6.3', 'A.6.8', 'A.8.15'],
    'Weak Email Security': ['A.8.15', 'A.5.14', 'A.8.13'],
    'Insufficient Access Controls': ['A.5.15', 'A.5.18', 'A.8.2']
  },
  'Insider Threat': {
    'Excessive User Privileges': ['A.8.2', 'A.5.18', 'A.5.15'],
    'Lack of User Training': ['A.6.2', 'A.6.3', 'A.6.4'],
    'Insufficient Monitoring': ['A.8.16', 'A.5.24', 'A.8.15']
  },
  'DDoS Attack': {
    'Insufficient Network Protection': ['A.8.20', 'A.5.29', 'A.5.30'],
    'Poor Incident Response': ['A.5.24', 'A.5.29', 'A.5.30']
  },
  'Data Breach': {
    'Weak Database Encryption': ['A.8.24', 'A.8.23', 'A.8.20'],
    'Insufficient Access Controls': ['A.5.15', 'A.5.18', 'A.8.2'],
    'Poor Data Classification': ['A.5.12', 'A.5.13', 'A.5.31']
  }
}

const iso27001Controls: Control[] = [
  // A.5 Organizational Controls
  { id: 'A.5.1', name: 'Policies for information security', category: 'Organizational Controls', description: 'Information security policy and topic-specific policies shall be defined, approved by management, published, communicated to and acknowledged by relevant personnel and relevant interested parties, and reviewed at planned intervals and if significant changes occur.', iso27001Reference: 'A.5.1', implementationGuidance: 'Develop comprehensive information security policies covering all aspects of information security management.', cost: 'Low', complexity: 'Low', timeframe: 'Short-term' },
  { id: 'A.5.2', name: 'Information Security Roles and Responsibilities', category: 'Organizational Controls', description: 'Information security roles and responsibilities shall be defined and allocated in accordance with the organization needs.', iso27001Reference: 'A.5.2', implementationGuidance: 'Define and document roles and responsibilities for information security throughout the organization.', cost: 'Low', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.3', name: 'Segregation of duties', category: 'Organizational Controls', description: 'Conflicting duties and areas of responsibility shall be segregated to reduce opportunities for unauthorized or unintentional modification or misuse of the organization assets.', iso27001Reference: 'A.5.3', implementationGuidance: 'Implement segregation of duties to prevent conflicts of interest and reduce risk of errors or fraud.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.4', name: 'Management responsibilities', category: 'Organizational Controls', description: 'Management shall require all personnel to apply information security in accordance with the established policies and procedures of the organization.', iso27001Reference: 'A.5.4', implementationGuidance: 'Establish management oversight and accountability for information security implementation.', cost: 'Low', complexity: 'Low', timeframe: 'Immediate' },
  { id: 'A.5.5', name: 'Contact with authorities', category: 'Organizational Controls', description: 'Appropriate contacts with relevant authorities shall be maintained.', iso27001Reference: 'A.5.5', implementationGuidance: 'Establish and maintain relationships with law enforcement, regulators, and other relevant authorities.', cost: 'Low', complexity: 'Low', timeframe: 'Short-term' },
  { id: 'A.5.6', name: 'Contact with special interest groups', category: 'Organizational Controls', description: 'Appropriate contacts with special interest groups or other specialist security forums and professional associations shall be maintained.', iso27001Reference: 'A.5.6', implementationGuidance: 'Participate in security communities and maintain awareness of emerging threats and best practices.', cost: 'Low', complexity: 'Low', timeframe: 'Short-term' },
  { id: 'A.5.7', name: 'Threat intelligence', category: 'Organizational Controls', description: 'Information relating to information security threats shall be collected and analysed to produce threat intelligence.', iso27001Reference: 'A.5.7', implementationGuidance: 'Implement threat intelligence gathering and analysis capabilities to stay informed of current threats.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.8', name: 'Information security in project management', category: 'Organizational Controls', description: 'Information security shall be integrated into project management.', iso27001Reference: 'A.5.8', implementationGuidance: 'Integrate security considerations into all project management processes and methodologies.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.9', name: 'Inventory of information and other associated assets', category: 'Organizational Controls', description: 'An inventory of information and other associated assets, including owners, shall be developed and maintained.', iso27001Reference: 'A.5.9', implementationGuidance: 'Maintain a comprehensive inventory of all information assets and assign clear ownership.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.10', name: 'Acceptable use of information and other associated assets', category: 'Organizational Controls', description: 'Rules for the acceptable use and procedures for handling information and other associated assets shall be identified, documented and implemented.', iso27001Reference: 'A.5.10', implementationGuidance: 'Develop and communicate acceptable use policies for all organizational assets.', cost: 'Low', complexity: 'Low', timeframe: 'Short-term' },
  { id: 'A.5.11', name: 'Return of assets', category: 'Organizational Controls', description: 'All employees and external party users shall return all of the organizational assets in their possession upon termination of their employment, contract or agreement.', iso27001Reference: 'A.5.11', implementationGuidance: 'Establish procedures for asset return during employment termination or contract completion.', cost: 'Low', complexity: 'Low', timeframe: 'Short-term' },
  { id: 'A.5.12', name: 'Classification of information', category: 'Organizational Controls', description: 'Information shall be classified according to the information security needs of the organization based on confidentiality, integrity, availability and relevant interested party requirements.', iso27001Reference: 'A.5.12', implementationGuidance: 'Implement an information classification scheme and ensure proper labeling and handling.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.13', name: 'Labelling of information', category: 'Organizational Controls', description: 'An appropriate set of procedures for information labelling shall be developed and implemented in accordance with the information classification scheme adopted by the organization.', iso27001Reference: 'A.5.13', implementationGuidance: 'Develop and implement information labeling procedures consistent with classification scheme.', cost: 'Low', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.14', name: 'Information transfer', category: 'Organizational Controls', description: 'Information transfer rules, procedures or agreements shall be in place for all types of transfer facilities within the organization and between the organization and other parties.', iso27001Reference: 'A.5.14', implementationGuidance: 'Establish secure information transfer procedures including email security and file sharing controls.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.15', name: 'Access control', category: 'Organizational Controls', description: 'Rules to control physical and logical access to information and other associated assets shall be established and implemented based on business and information security requirements.', iso27001Reference: 'A.5.15', implementationGuidance: 'Establish access control policies and procedures based on business requirements.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.16', name: 'Identity management', category: 'Organizational Controls', description: 'The full life cycle of identities shall be managed.', iso27001Reference: 'A.5.16', implementationGuidance: 'Implement identity lifecycle management from creation to deletion.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.5.17', name: 'Authentication information', category: 'Organizational Controls', description: 'Allocation and management of authentication information shall be controlled by a management process.', iso27001Reference: 'A.5.17', implementationGuidance: 'Implement secure management of authentication credentials and tokens.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.18', name: 'Access rights', category: 'Organizational Controls', description: 'Access rights to information and other associated assets shall be provisioned, reviewed, modified and removed in accordance with the organization topic-specific policy on access control.', iso27001Reference: 'A.5.18', implementationGuidance: 'Implement access rights management with regular reviews and updates.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.5.19', name: 'Information security in supplier relationships', category: 'Organizational Controls', description: 'Processes and procedures shall be defined and implemented to manage the information security risks associated with the use of supplier products or services.', iso27001Reference: 'A.5.19', implementationGuidance: 'Establish security requirements and controls for supplier relationships.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.20', name: 'Addressing information security within supplier agreements', category: 'Organizational Controls', description: 'Relevant information security requirements shall be established and agreed with each supplier that may access, process, store, communicate, or provide IT infrastructure components for, the organization information.', iso27001Reference: 'A.5.20', implementationGuidance: 'Include comprehensive security requirements in all supplier contracts and agreements.', cost: 'Low', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.21', name: 'Managing information security in the ICT supply chain', category: 'Organizational Controls', description: 'Processes and procedures shall be defined and implemented to manage the information security risks associated with the ICT products and services supply chain.', iso27001Reference: 'A.5.21', implementationGuidance: 'Implement supply chain security management for ICT products and services.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.5.22', name: 'Monitoring, review and change management of supplier services', category: 'Organizational Controls', description: 'The organization shall regularly monitor, review, evaluate and manage change in supplier information security practices and service delivery.', iso27001Reference: 'A.5.22', implementationGuidance: 'Establish ongoing monitoring and review processes for supplier security performance.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.23', name: 'Information security for use of cloud services', category: 'Organizational Controls', description: 'Processes for the acquisition, use, management and exit from cloud services shall be established in accordance with the organization information security requirements.', iso27001Reference: 'A.5.23', implementationGuidance: 'Develop cloud security governance including assessment, monitoring, and exit procedures.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.5.24', name: 'Information security incident management planning and preparation', category: 'Organizational Controls', description: 'The organization shall plan and prepare for managing information security incidents by defining, establishing and communicating information security incident management processes, roles and responsibilities.', iso27001Reference: 'A.5.24', implementationGuidance: 'Establish incident response procedures including detection, reporting, assessment, and recovery.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.25', name: 'Assessment and decision on information security events', category: 'Organizational Controls', description: 'The organization shall assess information security events and decide if they are to be categorized as information security incidents.', iso27001Reference: 'A.5.25', implementationGuidance: 'Implement event assessment and incident classification procedures.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.26', name: 'Response to information security incidents', category: 'Organizational Controls', description: 'Information security incidents shall be responded to in accordance with the documented procedures.', iso27001Reference: 'A.5.26', implementationGuidance: 'Develop and implement structured incident response procedures.', cost: 'Medium', complexity: 'High', timeframe: 'Short-term' },
  { id: 'A.5.27', name: 'Learning from information security incidents', category: 'Organizational Controls', description: 'Knowledge gained from analysing and resolving information security incidents shall be used to strengthen and improve the information security controls.', iso27001Reference: 'A.5.27', implementationGuidance: 'Implement lessons learned processes to improve security controls based on incidents.', cost: 'Low', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.28', name: 'Collection of evidence', category: 'Organizational Controls', description: 'The organization shall establish and implement procedures for the identification, collection, acquisition and preservation of information that can serve as evidence.', iso27001Reference: 'A.5.28', implementationGuidance: 'Establish forensic evidence collection and preservation procedures.', cost: 'Medium', complexity: 'High', timeframe: 'Short-term' },
  { id: 'A.5.29', name: 'Information security during disruption', category: 'Organizational Controls', description: 'The organization shall plan how to maintain information security at an appropriate level during disruption.', iso27001Reference: 'A.5.29', implementationGuidance: 'Integrate information security requirements into business continuity planning.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.5.30', name: 'ICT readiness for business continuity', category: 'Organizational Controls', description: 'ICT readiness shall be planned, implemented, maintained and tested based on business continuity objectives and ICT continuity requirements.', iso27001Reference: 'A.5.30', implementationGuidance: 'Implement redundant systems and infrastructure to ensure business continuity.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.5.31', name: 'Identification of legal, statutory, regulatory and contractual requirements', category: 'Organizational Controls', description: 'Legal, statutory, regulatory and contractual requirements relevant to information security and the organization approach to meet these requirements shall be identified, documented and kept up to date.', iso27001Reference: 'A.5.31', implementationGuidance: 'Establish compliance management processes to ensure adherence to legal and regulatory requirements.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.32', name: 'Intellectual property rights', category: 'Organizational Controls', description: 'The organization shall implement appropriate procedures to protect intellectual property rights.', iso27001Reference: 'A.5.32', implementationGuidance: 'Establish procedures to protect and manage intellectual property rights.', cost: 'Low', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.33', name: 'Protection of records', category: 'Organizational Controls', description: 'Records shall be protected from loss, destruction, falsification, unauthorized access and unauthorized release.', iso27001Reference: 'A.5.33', implementationGuidance: 'Implement records protection and retention procedures.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.34', name: 'Privacy and protection of PII', category: 'Organizational Controls', description: 'The organization shall identify and meet the requirements regarding the preservation of privacy and protection of PII according to applicable laws and regulations and contractual requirements.', iso27001Reference: 'A.5.34', implementationGuidance: 'Implement privacy protection measures and PII handling procedures.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.5.35', name: 'Independent review of information security', category: 'Organizational Controls', description: 'The organization approach to managing information security and its implementation shall be reviewed independently at planned intervals or when significant changes occur.', iso27001Reference: 'A.5.35', implementationGuidance: 'Conduct regular independent security reviews and assessments.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.36', name: 'Compliance with policies and standards for information security', category: 'Organizational Controls', description: 'Compliance with the organization information security policy, topic-specific policies, procedures and information security controls shall be regularly reviewed.', iso27001Reference: 'A.5.36', implementationGuidance: 'Implement regular compliance monitoring and review processes.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.5.37', name: 'Documented operating procedures', category: 'Organizational Controls', description: 'Operating procedures for information processing facilities shall be documented and made available to personnel who need them.', iso27001Reference: 'A.5.37', implementationGuidance: 'Document and maintain operating procedures for all critical systems and processes.', cost: 'Low', complexity: 'Medium', timeframe: 'Short-term' },

  // A.6 People Controls
  { id: 'A.6.1', name: 'Screening', category: 'People Controls', description: 'Background verification checks on all candidates for employment shall be carried out in accordance with relevant laws, regulations and ethics and shall be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.', iso27001Reference: 'A.6.1', implementationGuidance: 'Implement background screening procedures for all personnel with access to sensitive information.', cost: 'Medium', complexity: 'Low', timeframe: 'Immediate' },
  { id: 'A.6.2', name: 'Terms and conditions of employment', category: 'People Controls', description: 'The terms and conditions of employment shall address the personnel and the organization responsibilities for information security.', iso27001Reference: 'A.6.2', implementationGuidance: 'Include information security responsibilities in employment contracts and agreements.', cost: 'Low', complexity: 'Low', timeframe: 'Immediate' },
  { id: 'A.6.3', name: 'Information security awareness, education and training', category: 'People Controls', description: 'Personnel of the organization and relevant interested parties shall receive appropriate information security awareness, education and training and regular updates of the organization information security policy, topic-specific policies and procedures.', iso27001Reference: 'A.6.3', implementationGuidance: 'Implement comprehensive security awareness and training programs.', cost: 'Medium', complexity: 'Low', timeframe: 'Short-term' },
  { id: 'A.6.4', name: 'Disciplinary process', category: 'People Controls', description: 'A disciplinary process shall be formalized and communicated to take actions against personnel and other relevant interested parties who have committed an information security policy violation.', iso27001Reference: 'A.6.4', implementationGuidance: 'Establish formal disciplinary procedures that are communicated to all employees.', cost: 'Low', complexity: 'Low', timeframe: 'Short-term' },
  { id: 'A.6.5', name: 'Responsibilities after termination or change of employment', category: 'People Controls', description: 'Information security responsibilities and duties that remain valid after termination or change of employment shall be defined, enforced and communicated to relevant personnel and other interested parties.', iso27001Reference: 'A.6.5', implementationGuidance: 'Define post-employment security responsibilities and ensure proper handover procedures.', cost: 'Low', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.6.6', name: 'Confidentiality or non-disclosure agreements', category: 'People Controls', description: 'Confidentiality or non-disclosure agreements reflecting the organization needs for the protection of information shall be identified, documented, regularly reviewed and signed by personnel and other relevant interested parties.', iso27001Reference: 'A.6.6', implementationGuidance: 'Implement comprehensive confidentiality and non-disclosure agreements.', cost: 'Low', complexity: 'Low', timeframe: 'Short-term' },
  { id: 'A.6.7', name: 'Remote working', category: 'People Controls', description: 'Security measures shall be implemented when personnel are working remotely to protect information accessed, processed or stored outside the organization premises.', iso27001Reference: 'A.6.7', implementationGuidance: 'Implement security controls for remote work including secure connections and endpoint protection.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.6.8', name: 'Information security event reporting', category: 'People Controls', description: 'The organization shall provide a mechanism for personnel to report observed or suspected information security events through appropriate channels in a timely manner.', iso27001Reference: 'A.6.8', implementationGuidance: 'Establish clear incident reporting procedures and communication channels.', cost: 'Low', complexity: 'Low', timeframe: 'Short-term' },

  // A.7 Physical Controls
  { id: 'A.7.1', name: 'Physical security perimeter', category: 'Physical Controls', description: 'Physical security perimeters shall be defined and used to protect areas that contain information and other associated assets.', iso27001Reference: 'A.7.1', implementationGuidance: 'Establish and maintain physical security perimeters around sensitive areas.', cost: 'High', complexity: 'Medium', timeframe: 'Long-term' },
  { id: 'A.7.2', name: 'Physical entry controls', category: 'Physical Controls', description: 'Secure areas shall be protected by appropriate entry controls to ensure that only authorized personnel are allowed access.', iso27001Reference: 'A.7.2', implementationGuidance: 'Implement access control systems for physical entry to sensitive areas.', cost: 'High', complexity: 'Medium', timeframe: 'Long-term' },
  { id: 'A.7.3', name: 'Securing offices, rooms and facilities', category: 'Physical Controls', description: 'Physical security for offices, rooms and facilities shall be designed and implemented.', iso27001Reference: 'A.7.3', implementationGuidance: 'Design and implement appropriate physical security measures for work areas.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.7.4', name: 'Physical security monitoring', category: 'Physical Controls', description: 'Premises shall be continuously monitored for unauthorized physical access.', iso27001Reference: 'A.7.4', implementationGuidance: 'Implement continuous physical security monitoring systems.', cost: 'High', complexity: 'Medium', timeframe: 'Long-term' },
  { id: 'A.7.5', name: 'Protecting against physical and environmental threats', category: 'Physical Controls', description: 'Protection against physical and environmental threats shall be designed and implemented.', iso27001Reference: 'A.7.5', implementationGuidance: 'Implement protection against environmental threats like fire, flood, and power failure.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.7.6', name: 'Working in secure areas', category: 'Physical Controls', description: 'Security measures for working in secure areas shall be designed and implemented.', iso27001Reference: 'A.7.6', implementationGuidance: 'Establish procedures and controls for personnel working in secure areas.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.7.7', name: 'Clear desk and clear screen', category: 'Physical Controls', description: 'Clear desk rules for papers and removable storage media and clear screen rules for information processing facilities shall be defined and appropriately enforced.', iso27001Reference: 'A.7.7', implementationGuidance: 'Implement and enforce clear desk and clear screen policies.', cost: 'Low', complexity: 'Low', timeframe: 'Immediate' },
  { id: 'A.7.8', name: 'Equipment siting and protection', category: 'Physical Controls', description: 'Equipment shall be sited securely and protected.', iso27001Reference: 'A.7.8', implementationGuidance: 'Ensure secure placement and protection of all equipment.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.7.9', name: 'Security of assets off-premises', category: 'Physical Controls', description: 'Off-site assets shall be protected.', iso27001Reference: 'A.7.9', implementationGuidance: 'Implement security controls for assets used outside organizational premises.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.7.10', name: 'Storage media', category: 'Physical Controls', description: 'Storage media shall be managed in accordance with the classification scheme adopted by the organization.', iso27001Reference: 'A.7.10', implementationGuidance: 'Implement secure storage media handling and disposal procedures.', cost: 'Low', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.7.11', name: 'Supporting Utilities', category: 'Physical Controls', description: 'Information processing facilities shall be protected from power failures and other disruptions caused by failures in supporting utilities.', iso27001Reference: 'A.7.11', implementationGuidance: 'Implement redundant utilities and backup power systems.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.7.12', name: 'Cabling Security', category: 'Physical Controls', description: 'Power and telecommunications cabling carrying data or supporting information services shall be protected from interception, interference or damage.', iso27001Reference: 'A.7.12', implementationGuidance: 'Implement physical protection for data and power cabling.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.7.13', name: 'Equipment Maintenance', category: 'Physical Controls', description: 'Equipment shall be correctly maintained to ensure availability, integrity and confidentiality of information.', iso27001Reference: 'A.7.13', implementationGuidance: 'Establish equipment maintenance procedures that preserve security.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.7.14', name: 'Secure Disposal or Re-Use of Equipment', category: 'Physical Controls', description: 'Items of equipment containing storage media shall be verified to ensure that any sensitive data and licensed software has been removed or securely overwritten prior to disposal or re-use.', iso27001Reference: 'A.7.14', implementationGuidance: 'Implement secure data sanitization and equipment disposal procedures.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },

  // A.8 Technology Controls
  { id: 'A.8.1', name: 'User Endpoint Devices', category: 'Technology Controls', description: 'Information stored on, processed by or accessible via user endpoint devices shall be protected.', iso27001Reference: 'A.8.1', implementationGuidance: 'Implement endpoint protection controls for all user devices.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.2', name: 'Privileged Access Rights', category: 'Technology Controls', description: 'The allocation and use of privileged access rights shall be restricted and managed.', iso27001Reference: 'A.8.2', implementationGuidance: 'Implement strict controls on administrative and privileged access rights.', cost: 'Medium', complexity: 'High', timeframe: 'Short-term' },
  { id: 'A.8.3', name: 'Information Access Restriction', category: 'Technology Controls', description: 'Access to information and other associated assets shall be restricted in accordance with the established topic-specific policy on access control.', iso27001Reference: 'A.8.3', implementationGuidance: 'Implement information access controls based on business requirements and data classification.', cost: 'Medium', complexity: 'High', timeframe: 'Short-term' },
  { id: 'A.8.4', name: 'Access To Source Code', category: 'Technology Controls', description: 'Read and write access to source code, development tools and software libraries shall be appropriately managed.', iso27001Reference: 'A.8.4', implementationGuidance: 'Implement controls for source code access and version control.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.5', name: 'Secure Authentication', category: 'Technology Controls', description: 'Secure authentication technologies and procedures shall be implemented based on information access restrictions and the topic-specific policy on access control.', iso27001Reference: 'A.8.5', implementationGuidance: 'Implement strong authentication mechanisms including multi-factor authentication.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.6', name: 'Capacity Management', category: 'Technology Controls', description: 'The use of resources shall be monitored and tuned and projections of future capacity requirements shall be made to ensure the required system performance.', iso27001Reference: 'A.8.6', implementationGuidance: 'Implement capacity planning and resource monitoring to ensure system availability.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.7', name: 'Protection Against Malware', category: 'Technology Controls', description: 'Protection against malware shall be implemented and supported by appropriate user awareness.', iso27001Reference: 'A.8.7', implementationGuidance: 'Deploy comprehensive anti-malware solutions and maintain user awareness programs.', cost: 'Medium', complexity: 'Medium', timeframe: 'Immediate' },
  { id: 'A.8.8', name: 'Management of Technical Vulnerabilities', category: 'Technology Controls', description: 'Information about technical vulnerabilities of information systems in use shall be obtained, the organization exposure to such vulnerabilities evaluated and appropriate measures taken.', iso27001Reference: 'A.8.8', implementationGuidance: 'Establish vulnerability management processes including scanning, assessment, and patching.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.9', name: 'Configuration Management', category: 'Technology Controls', description: 'Configurations, including security configurations, of hardware, software, services and networks shall be established, documented, implemented, monitored and reviewed.', iso27001Reference: 'A.8.9', implementationGuidance: 'Implement configuration management to maintain secure system configurations.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.10', name: 'Information Deletion', category: 'Technology Controls', description: 'Information stored in information systems, devices or in any other storage media shall be deleted when no longer required.', iso27001Reference: 'A.8.10', implementationGuidance: 'Implement secure data deletion procedures and retention policies.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.11', name: 'Data Masking', category: 'Technology Controls', description: 'Data masking shall be used in accordance with the organization topic-specific policy on access control and other related topic-specific policies, and business requirements, taking applicable legislation into consideration.', iso27001Reference: 'A.8.11', implementationGuidance: 'Implement data masking for non-production environments and testing.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.12', name: 'Data Leakage Prevention', category: 'Technology Controls', description: 'Data leakage prevention measures shall be applied to systems, networks and any other devices that process, store or transmit information.', iso27001Reference: 'A.8.12', implementationGuidance: 'Implement data loss prevention technologies and procedures.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.13', name: 'Information Backup', category: 'Technology Controls', description: 'Backup copies of information, software and systems shall be maintained and regularly tested in accordance with the agreed topic-specific policy.', iso27001Reference: 'A.8.13', implementationGuidance: 'Implement comprehensive backup and recovery procedures with regular testing.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.14', name: 'Redundancy of Information Processing Facilities', category: 'Technology Controls', description: 'Information processing facilities shall be implemented with sufficient redundancy to meet availability requirements.', iso27001Reference: 'A.8.14', implementationGuidance: 'Implement redundant systems and infrastructure to ensure high availability.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.15', name: 'Logging', category: 'Technology Controls', description: 'Logs that record activities, exceptions, faults and other relevant events shall be produced, stored, protected and analysed.', iso27001Reference: 'A.8.15', implementationGuidance: 'Implement comprehensive logging and monitoring systems with regular review procedures.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.16', name: 'Monitoring Activities', category: 'Technology Controls', description: 'Networks, systems and applications shall be monitored for anomalous behaviour and appropriate actions taken to evaluate potential information security incidents.', iso27001Reference: 'A.8.16', implementationGuidance: 'Implement monitoring and detection systems for security events and anomalies.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.17', name: 'Clock Synchronisation', category: 'Technology Controls', description: 'The clocks of information processing systems used by the organization shall be synchronized to approved time sources.', iso27001Reference: 'A.8.17', implementationGuidance: 'Implement clock synchronization across all systems for accurate logging and forensics.', cost: 'Low', complexity: 'Low', timeframe: 'Short-term' },
  { id: 'A.8.18', name: 'Use of Privileged Utility Programs', category: 'Technology Controls', description: 'The use of utility programs that can be capable of overriding system and application controls shall be restricted and tightly controlled.', iso27001Reference: 'A.8.18', implementationGuidance: 'Implement strict controls on administrative and privileged access tools.', cost: 'Medium', complexity: 'High', timeframe: 'Short-term' },
  { id: 'A.8.19', name: 'Installation of Software on Operational Systems', category: 'Technology Controls', description: 'Procedures shall be implemented to control the installation of software on operational systems.', iso27001Reference: 'A.8.19', implementationGuidance: 'Implement software installation controls and change management procedures.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.20', name: 'Network Security', category: 'Technology Controls', description: 'Networks and network devices shall be secured, managed and controlled to protect information in systems and applications.', iso27001Reference: 'A.8.20', implementationGuidance: 'Implement network security controls including firewalls, intrusion detection, and network segmentation.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.21', name: 'Security of Network Services', category: 'Technology Controls', description: 'Security mechanisms, service levels and requirements of network services shall be identified, implemented and monitored.', iso27001Reference: 'A.8.21', implementationGuidance: 'Implement security controls for network services and monitor service levels.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.22', name: 'Segregation of Networks', category: 'Technology Controls', description: 'Groups of information services, users and information systems shall be segregated in the organization networks.', iso27001Reference: 'A.8.22', implementationGuidance: 'Implement network segmentation to isolate different types of systems and users.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.23', name: 'Web Filtering', category: 'Technology Controls', description: 'Access to external websites shall be managed to reduce exposure to malicious content.', iso27001Reference: 'A.8.23', implementationGuidance: 'Implement web filtering and content control systems.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.24', name: 'Use of Cryptography', category: 'Technology Controls', description: 'Rules for the effective use of cryptography, including cryptographic key management, shall be defined and implemented.', iso27001Reference: 'A.8.24', implementationGuidance: 'Implement appropriate cryptographic controls to protect sensitive information in transit and at rest.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.25', name: 'Secure Development Life Cycle', category: 'Technology Controls', description: 'Rules for the secure development of software and systems shall be established and applied.', iso27001Reference: 'A.8.25', implementationGuidance: 'Integrate security into the entire software development lifecycle.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.26', name: 'Application Security Requirements', category: 'Technology Controls', description: 'Information security requirements shall be identified, specified and approved when developing or acquiring applications.', iso27001Reference: 'A.8.26', implementationGuidance: 'Define and implement security requirements for application development and acquisition.', cost: 'Medium', complexity: 'High', timeframe: 'Short-term' },
  { id: 'A.8.27', name: 'Secure Systems Architecture and Engineering Principles', category: 'Technology Controls', description: 'Principles for engineering secure systems shall be established, documented, maintained and applied to any information system development activities.', iso27001Reference: 'A.8.27', implementationGuidance: 'Establish secure system architecture principles and apply them consistently.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.28', name: 'Secure Coding', category: 'Technology Controls', description: 'Secure coding principles shall be applied to software development.', iso27001Reference: 'A.8.28', implementationGuidance: 'Integrate security controls into development lifecycle and change management processes.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.29', name: 'Security Testing in Development and Acceptance', category: 'Technology Controls', description: 'Security testing processes shall be defined and implemented in the development lifecycle.', iso27001Reference: 'A.8.29', implementationGuidance: 'Implement security testing procedures including vulnerability assessments and penetration testing.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.30', name: 'Outsourced Development', category: 'Technology Controls', description: 'The organization shall direct, monitor and review the activities related to outsourced system development.', iso27001Reference: 'A.8.30', implementationGuidance: 'Implement oversight and security requirements for outsourced development activities.', cost: 'Medium', complexity: 'High', timeframe: 'Short-term' },
  { id: 'A.8.31', name: 'Separation of Development, Test and Production Environments', category: 'Technology Controls', description: 'Development, testing and production environments shall be separated and secured.', iso27001Reference: 'A.8.31', implementationGuidance: 'Implement proper separation and security controls for different environment types.', cost: 'High', complexity: 'High', timeframe: 'Long-term' },
  { id: 'A.8.32', name: 'Change Management', category: 'Technology Controls', description: 'Changes to information processing facilities and information systems shall be subject to change management procedures.', iso27001Reference: 'A.8.32', implementationGuidance: 'Implement formal change management procedures for all systems and applications.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.33', name: 'Test Information', category: 'Technology Controls', description: 'Test data shall be selected carefully, protected and controlled.', iso27001Reference: 'A.8.33', implementationGuidance: 'Implement controls for test data management including data anonymization and protection.', cost: 'Medium', complexity: 'Medium', timeframe: 'Short-term' },
  { id: 'A.8.34', name: 'Protection of information systems during audit testing', category: 'Technology Controls', description: 'Audit tests and other assurance activities involving assessment of operational systems shall be planned and agreed between the tester and appropriate management.', iso27001Reference: 'A.8.34', implementationGuidance: 'Establish procedures to protect systems during audit and security testing activities.', cost: 'Low', complexity: 'Medium', timeframe: 'Short-term' }
]

const riskStrategies = [
  { value: 'mitigate', label: 'Mitigate', description: 'Reduce the likelihood or impact through controls', color: 'blue' },
  { value: 'accept', label: 'Accept', description: 'Accept the risk without additional controls', color: 'yellow' },
  { value: 'transfer', label: 'Transfer', description: 'Transfer the risk to a third party (insurance, outsourcing)', color: 'purple' },
  { value: 'avoid', label: 'Avoid', description: 'Eliminate the risk by removing the source or activity', color: 'red' }
]

const RiskTreatment: React.FC<RiskTreatmentProps> = ({ scopeData }) => {
  const [risks, setRisks] = useState<Risk[]>([])
  const [treatments, setTreatments] = useState<Treatment[]>([])
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null)
  const [currentTreatment, setCurrentTreatment] = useState<Partial<Treatment>>({
    strategy: 'mitigate',
    selectedControls: [],
    justification: '',
    owner: '',
    deadline: '',
    cost: 0,
    notes: ''
  })
  const [showControlSelection, setShowControlSelection] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [saveNotification, setSaveNotification] = useState(false)

  // Load risks from Risk Assessment
  const loadRisksFromAssessment = () => {
    // Use the correct storage key 'isms-risk-assessment'
    const savedRisks = localStorage.getItem('isms-risk-assessment')

    if (savedRisks) {
      try {
        const riskData = JSON.parse(savedRisks)

        if (riskData.risks && riskData.risks.length > 0) {
          // Transform risks to include asset, threat, and vulnerability names
          const transformedRisks = riskData.risks.map((risk: any) => {
            const asset = riskData.assets?.find((a: any) => a.id === risk.assetId)
            const threat = riskData.threats?.find((t: any) => t.id === risk.threatId)
            const vulnerability = riskData.vulnerabilities?.find((v: any) => v.id === risk.vulnerabilityId)

            // Calculate risk score
            const likelihoodValues: Record<string, number> = { 'very-low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very-high': 5 }
            const impactValues: Record<string, number> = { 'very-low': 1, 'low': 2, 'medium': 3, 'high': 4, 'very-high': 5 }
            const likelihoodScore = likelihoodValues[risk.likelihood] || 3
            const impactScore = impactValues[risk.impact] || 3
            const riskScore = likelihoodScore * impactScore

            return {
              id: risk.id,
              assetId: risk.assetId,
              assetName: asset?.name || 'Unknown Asset',
              threatId: risk.threatId,
              threatName: threat?.name || 'Unknown Threat',
              vulnerabilityId: risk.vulnerabilityId,
              vulnerabilityName: vulnerability?.name || 'Unknown Vulnerability',
              likelihood: risk.likelihood,
              impact: risk.impact,
              riskLevel: risk.riskLevel,
              riskScore: riskScore,
              description: `${threat?.description || 'No description'} affecting ${asset?.name || 'unknown asset'}`,
              currentControls: risk.controls?.join(', ') || 'None'
            }
          })

          setRisks(transformedRisks)
          return true
        }
      } catch (error) {
        console.error('Error loading risks:', error)
      }
    }
    return false
  }

  useEffect(() => {
    // Initial load
    const hasRisks = loadRisksFromAssessment()

    if (!hasRisks) {
      // Create some sample risks for testing
      const sampleRisks = [
        {
          id: 'risk-1',
          assetId: 'asset-1',
          assetName: 'Web Server',
          threatId: 'threat-1',
          threatName: 'SQL Injection Attack',
          vulnerabilityId: 'vuln-1',
          vulnerabilityName: 'Unvalidated Input',
          likelihood: 'high',
          impact: 'high',
          riskLevel: 'Very High',
          riskScore: 20,
          description: 'SQL injection vulnerability in login form',
          currentControls: 'Basic input validation'
        },
        {
          id: 'risk-2',
          assetId: 'asset-2',
          assetName: 'File Server',
          threatId: 'threat-2',
          threatName: 'Malware Attack',
          vulnerabilityId: 'vuln-2',
          vulnerabilityName: 'Missing Security Patches',
          likelihood: 'medium',
          impact: 'high',
          riskLevel: 'High',
          riskScore: 15,
          description: 'Unpatched server vulnerable to ransomware',
          currentControls: 'Antivirus software'
        }
      ]

      setRisks(sampleRisks)
    }

    // Load existing treatments
    const savedTreatments = localStorage.getItem('riskTreatments')
    if (savedTreatments) {
      try {
        const treatmentData = JSON.parse(savedTreatments)
        setTreatments(treatmentData)
      } catch (error) {
        console.error('Error loading treatments:', error)
      }
    }

    // Listen for updates from Risk Assessment
    const handleRiskAssessmentUpdate = () => {
      loadRisksFromAssessment()
    }

    window.addEventListener('storage', handleRiskAssessmentUpdate)
    window.addEventListener('isms-data-updated', handleRiskAssessmentUpdate)

    return () => {
      window.removeEventListener('storage', handleRiskAssessmentUpdate)
      window.removeEventListener('isms-data-updated', handleRiskAssessmentUpdate)
    }
  }, [])

  const getRecommendedControls = (risk: Risk) => {
    // Get controls based on threat-vulnerability mapping
    const threatMapping = threatVulnerabilityControlMapping[risk.threatName]
    if (!threatMapping) return []

    const recommendedControlIds = threatMapping[risk.vulnerabilityName] || []
    return recommendedControlIds
  }

  const getFilteredControls = () => {
    let controlsToShow = iso27001Controls

    // If we have a selected risk, show only relevant controls for that threat-vulnerability combination
    if (selectedRisk) {
      const risk = risks.find(r => r.id === selectedRisk)
      if (risk) {
        const recommendedIds = getRecommendedControls(risk)

        // Filter to show only relevant controls based on threat-vulnerability mapping
        if (recommendedIds.length > 0) {
          controlsToShow = iso27001Controls.filter(control =>
            recommendedIds.includes(control.id)
          )
        }
      }
    }

    // Apply search filter
    if (searchTerm) {
      controlsToShow = controlsToShow.filter(control =>
        control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        control.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return controlsToShow
  }

  const calculateResidualRisk = (originalRisk: Risk, selectedControls: string[]): { level: string, score: number } => {
    const controlCount = selectedControls.length
    const riskReduction = Math.min(controlCount * 0.3, 0.8) // Max 80% reduction
    const newScore = Math.max(originalRisk.riskScore * (1 - riskReduction), 1)

    let level = 'Very Low'
    if (newScore >= 15) level = 'Very High'
    else if (newScore >= 10) level = 'High'
    else if (newScore >= 6) level = 'Medium'
    else if (newScore >= 3) level = 'Low'

    return { level, score: Math.round(newScore) }
  }

  const handleStrategyChange = (strategy: string) => {
    setCurrentTreatment(prev => ({
      ...prev,
      strategy: strategy as 'mitigate' | 'accept' | 'transfer' | 'avoid'
    }))
  }

  const toggleControlSelection = (controlId: string) => {
    setCurrentTreatment(prev => ({
      ...prev,
      selectedControls: prev.selectedControls?.includes(controlId)
        ? prev.selectedControls.filter(id => id !== controlId)
        : [...(prev.selectedControls || []), controlId]
    }))
  }

  const saveTreatment = () => {
    if (!selectedRisk) return

    const risk = risks.find(r => r.id === selectedRisk)
    if (!risk) return

    const residualRisk = calculateResidualRisk(risk, currentTreatment.selectedControls || [])

    const treatment: Treatment = {
      id: Date.now().toString(),
      riskId: selectedRisk,
      strategy: currentTreatment.strategy || 'mitigate',
      selectedControls: currentTreatment.selectedControls || [],
      residualRiskLevel: residualRisk.level,
      residualRiskScore: residualRisk.score,
      justification: currentTreatment.justification || '',
      owner: currentTreatment.owner || '',
      deadline: currentTreatment.deadline || '',
      status: 'planned',
      cost: currentTreatment.cost || 0,
      notes: currentTreatment.notes || ''
    }

    const updatedTreatments = [...treatments.filter(t => t.riskId !== selectedRisk), treatment]
    setTreatments(updatedTreatments)
    localStorage.setItem('riskTreatments', JSON.stringify(updatedTreatments))

    // Dispatch custom event to notify other components (like Dashboard)
    window.dispatchEvent(new Event('isms-data-updated'))

    // Show save notification
    setSaveNotification(true)
    setTimeout(() => setSaveNotification(false), 3000)

    // Reset form
    setSelectedRisk(null)
    setCurrentTreatment({
      strategy: 'mitigate',
      selectedControls: [],
      justification: '',
      owner: '',
      deadline: '',
      cost: 0,
      notes: ''
    })
    setShowControlSelection(false)
  }

  const editTreatment = (riskId: string) => {
    const treatment = treatments.find(t => t.riskId === riskId)
    if (!treatment) return

    // Set the selected risk and populate form with existing treatment data
    setSelectedRisk(riskId)
    setCurrentTreatment({
      strategy: treatment.strategy,
      selectedControls: treatment.selectedControls,
      justification: treatment.justification,
      owner: treatment.owner,
      deadline: treatment.deadline,
      cost: treatment.cost,
      notes: treatment.notes
    })
    setShowControlSelection(true)
  }

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'very high': return 'text-red-800 bg-red-50 border-red-200'
      case 'high': return 'text-orange-800 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-800 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-800 bg-blue-50 border-blue-200'
      case 'very low': return 'text-green-800 bg-green-50 border-green-200'
      default: return 'text-gray-800 bg-gray-50 border-gray-200'
    }
  }

  const getStrategyColor = (strategy: string) => {
    const strategyObj = riskStrategies.find(s => s.value === strategy)
    return strategyObj ? strategyObj.color : 'gray'
  }

  const exportTreatmentPlan = () => {
    const data = {
      organization: scopeData?.organizationName || 'Organization',
      generatedDate: new Date().toLocaleDateString(),
      treatments: treatments.map(treatment => {
        const risk = risks.find(r => r.id === treatment.riskId)
        const controls = treatment.selectedControls.map(id =>
          iso27001Controls.find(c => c.id === id)
        ).filter(Boolean)

        return {
          risk: risk ? {
            asset: risk.assetName,
            threat: risk.threatName,
            vulnerability: risk.vulnerabilityName,
            originalLevel: risk.riskLevel,
            originalScore: risk.riskScore
          } : null,
          treatment: {
            strategy: treatment.strategy,
            controls: controls.map(c => ({
              id: c!.id,
              name: c!.name,
              category: c!.category
            })),
            residualLevel: treatment.residualRiskLevel,
            residualScore: treatment.residualRiskScore,
            owner: treatment.owner,
            deadline: treatment.deadline,
            justification: treatment.justification
          }
        }
      })
    }

    const markdown = `# Risk Treatment Plan
## ${data.organization}
**Generated:** ${data.generatedDate}

${data.treatments.map((item, index) => `
### Treatment ${index + 1}

**Risk Details:**
- **Asset:** ${item.risk?.asset || 'N/A'}
- **Threat:** ${item.risk?.threat || 'N/A'}
- **Vulnerability:** ${item.risk?.vulnerability || 'N/A'}
- **Original Risk Level:** ${item.risk?.originalLevel || 'N/A'} (Score: ${item.risk?.originalScore || 'N/A'})

**Treatment Strategy:** ${item.treatment.strategy.toUpperCase()}

**Selected Controls:**
${item.treatment.controls.map(control => `- **${control.id}:** ${control.name} (${control.category})`).join('\n')}

**Residual Risk:** ${item.treatment.residualLevel} (Score: ${item.treatment.residualScore})

**Owner:** ${item.treatment.owner || 'Not assigned'}
**Deadline:** ${item.treatment.deadline || 'Not set'}

**Justification:** ${item.treatment.justification || 'No justification provided'}

---
`).join('')}
`

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(scopeData?.organizationName || 'organization').toLowerCase().replace(/\s+/g, '-')}-risk-treatment-plan.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const untreatedRisks = risks.filter(risk => !treatments.some(t => t.riskId === risk.id))
  const treatedRisks = risks.filter(risk => treatments.some(t => t.riskId === risk.id))

  return (
    <div className="space-y-6">
      {/* Save Notification */}
      {saveNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Risk treatment saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="rounded-xl p-6" style={{backgroundColor: '#1e3a8a', color: 'white'}}>
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Risk Treatment</h2>
        </div>
        <p className="text-blue-100 mb-4">
          Evaluate identified risks and select treatment options: reduce, transfer, avoid, or accept. Choose Annex A controls for risk reduction.
        </p>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{risks.length}</div>
            <div className="text-sm font-medium" style={{color: '#dbeafe'}}>Total Risks</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{treatments.length}</div>
            <div className="text-sm font-medium" style={{color: '#dbeafe'}}>Treated</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{untreatedRisks.length}</div>
            <div className="text-sm font-medium" style={{color: '#dbeafe'}}>Pending</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold" style={{color: 'white'}}>{iso27001Controls.length}</div>
            <div className="text-sm font-medium" style={{color: '#dbeafe'}}>Controls Available</div>
          </div>
        </div>
      </div>

      {/* Risk Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Untreated Risks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Risks Requiring Treatment ({untreatedRisks.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {untreatedRisks.map(risk => (
              <div
                key={risk.id}
                onClick={() => setSelectedRisk(risk.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedRisk === risk.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{risk.assetName}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskLevelColor(risk.riskLevel)}`}>
                    {risk.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{risk.threatName}</p>
                <p className="text-xs text-gray-500 mt-1">{risk.vulnerabilityName}</p>
              </div>
            ))}
            {untreatedRisks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
                <p>All risks have been treated!</p>
              </div>
            )}
          </div>
        </div>

        {/* Treated Risks */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Treated Risks ({treatedRisks.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {treatedRisks.map(risk => {
              const treatment = treatments.find(t => t.riskId === risk.id)
              return (
                <div key={risk.id} className="p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{risk.assetName}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getRiskLevelColor(treatment?.residualRiskLevel || 'Low')}`}>
                        {treatment?.residualRiskLevel}
                      </span>
                      <span className={
                        treatment?.strategy === 'mitigate' ? 'px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800' :
                        treatment?.strategy === 'accept' ? 'px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800' :
                        treatment?.strategy === 'transfer' ? 'px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800' :
                        treatment?.strategy === 'avoid' ? 'px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800' :
                        'px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800'
                      }>
                        {treatment?.strategy}
                      </span>
                      <button
                        onClick={() => editTreatment(risk.id)}
                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="Edit treatment"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{risk.threatName}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {treatment?.selectedControls.length || 0} controls selected
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Treatment Form */}
      {selectedRisk && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {treatments.some(t => t.riskId === selectedRisk) ? 'Edit Risk Treatment' : 'Define Risk Treatment'}
            </h3>
            <button
              onClick={() => setSelectedRisk(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Risk Details */}
          {(() => {
            const risk = risks.find(r => r.id === selectedRisk)
            if (!risk) return null

            return (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-2">Risk Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Asset:</span> {risk.assetName}
                  </div>
                  <div>
                    <span className="font-medium">Current Risk Level:</span> {risk.riskLevel} (Score: {risk.riskScore})
                  </div>
                  <div>
                    <span className="font-medium">Threat:</span> {risk.threatName}
                  </div>
                  <div>
                    <span className="font-medium">Vulnerability:</span> {risk.vulnerabilityName}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Treatment Strategy */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Treatment Strategy</label>
            <div className="grid grid-cols-2 gap-3">
              {riskStrategies.map(strategy => (
                <button
                  key={strategy.value}
                  onClick={() => handleStrategyChange(strategy.value)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    currentTreatment.strategy === strategy.value
                      ? strategy.value === 'mitigate' ? 'border-blue-500 bg-blue-50' :
                        strategy.value === 'accept' ? 'border-yellow-500 bg-yellow-50' :
                        strategy.value === 'transfer' ? 'border-purple-500 bg-purple-50' :
                        strategy.value === 'avoid' ? 'border-red-500 bg-red-50' :
                        'border-gray-500 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{strategy.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{strategy.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Control Selection (for Mitigate strategy) */}
          {currentTreatment.strategy === 'mitigate' && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Security Controls</label>
                <button
                  onClick={() => setShowControlSelection(!showControlSelection)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Controls ({showControlSelection ? 'Hide' : 'Show'})
                </button>
              </div>

              {/* Selected Controls */}
              {currentTreatment.selectedControls && currentTreatment.selectedControls.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">Selected Controls</h5>
                  <div className="space-y-2">
                    {currentTreatment.selectedControls.map(controlId => {
                      const control = iso27001Controls.find(c => c.id === controlId)
                      return control ? (
                        <div key={controlId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div>
                            <div className="font-medium text-blue-900">{control.id}: {control.name}</div>
                            <div className="text-sm text-blue-700">{control.category}</div>
                          </div>
                          <button
                            onClick={() => toggleControlSelection(controlId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* Control Selection Panel */}
              {showControlSelection && (
                <div className="border border-gray-200 rounded-lg p-4">
                  {/* Intelligent Recommendations Info */}
                  {(() => {
                    const risk = risks.find(r => r.id === selectedRisk)
                    const recommendedIds = risk ? getRecommendedControls(risk) : []

                    if (recommendedIds.length > 0) {
                      return (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-green-600">💡</span>
                            <h5 className="font-medium text-green-800">Intelligent Recommendations</h5>
                          </div>
                          <p className="text-sm text-green-700">
                            Based on the threat <strong>"{risk?.threatName}"</strong> and vulnerability <strong>"{risk?.vulnerabilityName}"</strong>,
                            we recommend {recommendedIds.length} specific control{recommendedIds.length > 1 ? 's' : ''} that directly address this risk scenario.
                            Recommended controls are highlighted with a ⭐ badge and green background.
                          </p>
                        </div>
                      )
                    }
                    return null
                  })()}
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search controls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {(() => {
                      const filteredControls = getFilteredControls()

                      if (filteredControls.length === 0) {
                        return (
                          <div className="text-center py-4 text-gray-500">
                            <p>No controls found matching your search criteria.</p>
                            {searchTerm && <p>Search term: "{searchTerm}"</p>}
                          </div>
                        )
                      }

                      return filteredControls.map(control => {
                        const risk = risks.find(r => r.id === selectedRisk)
                        const isRecommended = risk ? getRecommendedControls(risk).includes(control.id) : false

                        return (
                      <div
                        key={control.id}
                        onClick={() => toggleControlSelection(control.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          currentTreatment.selectedControls?.includes(control.id)
                            ? 'border-blue-500 bg-blue-50'
                            : isRecommended
                            ? 'border-green-300 bg-green-50 hover:border-green-400'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${isRecommended ? 'ring-1 ring-green-200' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium text-gray-900">{control.id}: {control.name}</div>
                              {isRecommended && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                  ⭐ Recommended
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600">{control.category}</div>
                            <div className="text-xs text-gray-500 mt-1">{control.description}</div>
                            {isRecommended && (
                              <div className="text-xs text-green-600 mt-1 font-medium">
                                💡 Specifically addresses: {risk?.threatName} → {risk?.vulnerabilityName}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            <div>Cost: {control.cost}</div>
                            <div>Time: {control.timeframe}</div>
                          </div>
                        </div>
                      </div>
                      )
                      })
                    })()}
                  </div>
                </div>
              )}

              {/* Residual Risk Calculation */}
              {currentTreatment.selectedControls && currentTreatment.selectedControls.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-medium text-green-800 mb-2">Estimated Residual Risk</h5>
                  {(() => {
                    const risk = risks.find(r => r.id === selectedRisk)
                    if (risk) {
                      const residual = calculateResidualRisk(risk, currentTreatment.selectedControls)
                      return (
                        <div className="text-sm text-green-700">
                          With {currentTreatment.selectedControls.length} control(s), the residual risk is estimated to be{' '}
                          <span className="font-medium">{residual.level}</span> (Score: {residual.score})
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Additional Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Owner *</label>
              <input
                type="text"
                value={currentTreatment.owner || ''}
                onChange={(e) => setCurrentTreatment(prev => ({ ...prev, owner: e.target.value }))}
                placeholder="Who will be responsible for this treatment?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Completion Date</label>
              <input
                type="date"
                value={currentTreatment.deadline || ''}
                onChange={(e) => setCurrentTreatment(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Justification *</label>
            <textarea
              value={currentTreatment.justification || ''}
              onChange={(e) => setCurrentTreatment(prev => ({ ...prev, justification: e.target.value }))}
              placeholder="Explain why this treatment approach was chosen..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Implementation Notes</label>
            <textarea
              value={currentTreatment.notes || ''}
              onChange={(e) => setCurrentTreatment(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about implementation..."
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveTreatment}
              disabled={!currentTreatment.owner || !currentTreatment.justification}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              {treatments.some(t => t.riskId === selectedRisk) ? 'Update Treatment Plan' : 'Save Treatment Plan'}
            </button>
          </div>
        </div>
      )}

      {/* Export Button */}
      {treatments.length > 0 && (
        <div className="text-center">
          <button
            onClick={exportTreatmentPlan}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            <Download className="w-5 h-5" />
            Export Treatment Plan
          </button>
        </div>
      )}
    </div>
  )
}

export default RiskTreatment