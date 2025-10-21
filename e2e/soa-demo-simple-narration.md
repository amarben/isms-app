# Statement of Applicability Demonstration - Simple Narrative Guide

## Introduction

This demonstration showcases a streamlined Statement of Applicability (SOA) creation process for ISO 27001:2022 compliance. The SOA is one of the most critical documents in the Information Security Management System, as it explicitly declares which of the 93 Annex A controls are applicable to the organization, which are not, and provides justification for each decision. This demonstration guides organizations through the systematic process of evaluating, documenting, and justifying control applicability decisions, ensuring complete traceability and audit readiness.

## The Journey Begins

The demonstration begins by accessing the ISMS Dashboard, which serves as the central hub for managing the organization's ISO 27001 implementation. This dashboard provides a comprehensive overview of the implementation journey, displaying progress across all major stages including scope definition, policy creation, risk assessment, and control implementation. The clean, intuitive interface immediately gives users insight into their current status and highlights areas requiring attention.

From the dashboard, we navigate to the "Statement of Applicability" section through the left sidebar navigation. This action initiates the SOA documentation workflow, a fundamental requirement for ISO 27001 certification. The Statement of Applicability is the bridge between risk assessment and control implementation—it transforms the organization's risk analysis into concrete decisions about which security controls to implement. ISO 27001 Clause 6.1.3d requires organizations to produce a Statement of Applicability that contains the necessary controls (from Annex A or elsewhere) and justification for their inclusion, whether they are implemented or not, and the justification for excluding any Annex A controls.

## Understanding the Control Landscape

Upon entering the Statement of Applicability interface, we are immediately presented with a comprehensive summary showing the total number of ISO 27001:2022 Annex A controls (93 in total) and how many have been classified in each category: Applicable, Partially Applicable, and Not Applicable. This high-level overview provides instant visibility into the organization's control coverage and helps management understand the scope of their security control framework.

ISO 27001:2022 Annex A contains 93 security controls organized into four themes: Organizational Controls, People Controls, Physical Controls, and Technological Controls. Each control addresses specific security objectives and has been carefully crafted by international security experts to represent current best practices in information security. Organizations must evaluate every single control and make an explicit decision about its applicability—there are no shortcuts or assumptions allowed. This comprehensive evaluation ensures that organizations have systematically considered all aspects of information security and made informed decisions based on their specific context, risk profile, and business requirements.

## Documenting Applicable Controls

The demonstration now proceeds to document several controls as "Applicable," showing the complete process for each. Applicable controls are those that the organization has determined are necessary and will be implemented (or are already implemented) to address identified risks and meet security objectives.

### Control A.5.1 - Policies for Information Security

We begin with Control A.5.1, "Policies for information security." This control is mandatory for ISO 27001 compliance—every certified organization must have documented information security policies. We click on the control to expand its details, revealing comprehensive information including the control's objective, implementation guidance, typical evidence requirements, and related controls.

We set the Applicability Status to "Applicable" and the Implementation Status to "Implemented," reflecting that this fundamental control is already in place. The Justification field is critical—this is where we explain why this control is necessary for our organization: "Mandatory control required for ISO 27001 compliance. Information security policies have been established, documented, and communicated to all employees." This justification provides clear traceability to ISO 27001 requirements and demonstrates top management commitment.

The Implementation Description field allows us to detail exactly how the control has been implemented: "Comprehensive information security policy framework established including policy statement, objectives, roles and responsibilities, and compliance requirements." This description provides auditors with concrete evidence of implementation and helps internal stakeholders understand what has been done.

We assign the Responsible Party as "CISO and Information Security Team," establishing clear accountability for this control's ongoing maintenance and effectiveness. This assignment ensures there is no ambiguity about who owns this control and who should be contacted for questions or audits.

### Control A.5.10 - Acceptable Use of Information

Moving to Control A.5.10, "Acceptable use of information and other associated assets," we demonstrate a control that is applicable but still in progress. This reflects real-world implementation where not all controls are fully mature at the time of initial SOA creation.

We set the status to "Applicable" with Implementation Status of "In Progress." The justification explains the business need: "Required to establish clear guidelines for acceptable use of information and information processing facilities to prevent misuse and security incidents." This clearly articulates why the control matters to the organization.

The Implementation Description provides visibility into current progress: "Acceptable Use Policy being developed and will be enforced through employee acknowledgment and regular awareness training." This transparency about implementation status is valuable for stakeholders and demonstrates honest self-assessment.

The Responsible Party is assigned to "HR and IT Security Team," reflecting the collaborative nature of this control which spans both human resources policies and technical security enforcement.

### Control A.5.15 - Access Control

For Control A.5.15, "Access control," we demonstrate a planned control with a target implementation date. This control is set to "Applicable" with Implementation Status of "Planned," showing how organizations can document controls they intend to implement in the near future.

The justification emphasizes the business value: "Critical for maintaining customer trust and protecting sensitive data. Access control rules based on least privilege principle must be established." This connects the technical control to business objectives and customer expectations.

The Implementation Description outlines the planned approach: "Implementing role-based access control (RBAC) system with regular access reviews and automated provisioning/de-provisioning." This level of detail helps stakeholders understand the implementation strategy and resource requirements.

We set a Target Implementation Date of December 31, 2025, providing a clear deadline and commitment for implementation. This target date creates accountability and allows progress tracking against commitments made in the SOA.

### Control A.8.2 - Privileged Access Rights

Control A.8.2, "Privileged access rights," demonstrates a fully implemented technical control. This is set to "Applicable" and "Implemented" to reflect mature security practices already in place.

The justification highlights threat prevention: "Necessary to prevent security incidents and protect against cyber threats by restricting privileged access to authorized personnel only." This directly links the control to risk mitigation and threat management.

The Implementation Description provides specific technical details: "Privileged access management (PAM) solution implemented with multi-factor authentication, session recording, and regular access audits." This specificity demonstrates genuine implementation and provides auditors with clear evidence requirements.

The Security Operations Team is designated as the Responsible Party, ensuring operational ownership of this critical security control.

### Control A.8.10 - Information Deletion

Finally, for applicable controls, we document A.8.10, "Information deletion," as "In Progress." This control addresses secure data disposal and retention management.

The justification connects to regulatory compliance: "Required to protect confidential information and meet data protection requirements. Secure deletion prevents data breaches from disposed storage media." This explicitly references GDPR and other data protection regulations.

The Implementation Description shows active development: "Developing data retention and secure deletion procedures with encryption of data at rest and secure wiping protocols for decommissioned devices." This demonstrates systematic progress toward full implementation.

The Data Protection Officer is assigned as the Responsible Party, aligning with typical organizational roles for data protection and privacy compliance.

## Documenting Partially Applicable Controls

The demonstration now addresses a "Partially Applicable" control, showing how organizations handle situations where a control is relevant in some contexts but not others.

### Control A.8.15 - Logging

Control A.8.15, "Logging," is marked as "Partially Applicable" with Implementation Status of "In Progress." This honest assessment reflects real-world situations where controls may be implemented for some systems but not yet comprehensive.

The justification explains the partial applicability: "Partially applicable - logging is implemented for critical systems but not yet comprehensive across all infrastructure. Full implementation requires additional SIEM capabilities." This transparency about limitations demonstrates honest self-assessment and helps auditors understand the current state.

The Implementation Description details what is currently in place: "Event logging active on production servers and databases. Expanding to cover network devices and cloud services with centralized SIEM platform." This shows both current capabilities and planned improvements, providing a complete picture of control maturity.

The SOC Team Lead is responsible for this control, establishing clear ownership for both current operations and future enhancements.

## Documenting Not Applicable Controls

The demonstration concludes by documenting controls that are "Not Applicable" to the organization. This is a critical part of the SOA because organizations must justify why they are excluding any Annex A controls—failure to adequately justify exclusions is a common finding in ISO 27001 audits.

### Control A.6.6 - Capacity Management

Control A.6.6, "Capacity management," is marked as "Not Applicable" with a clear justification: "Not applicable - all infrastructure is cloud-based with auto-scaling capabilities managed by cloud provider (AWS). Capacity management is handled automatically." This justification explicitly references the organization's technical architecture and explains why this control is not relevant.

This type of justification is acceptable because it shows that the control objective (ensuring adequate capacity) is achieved through alternative means (cloud auto-scaling), even though the specific control as written is not applicable to a pure cloud environment. Auditors will accept this reasoning if it accurately reflects the organization's situation.

### Control A.7.14 - Secure Disposal of Equipment

Similarly, Control A.7.14, "Secure disposal or re-use of equipment," is marked as "Not Applicable" with justification: "Not applicable - organization operates entirely on cloud infrastructure with no physical on-premise equipment to dispose. Equipment disposal is managed by cloud service provider." This demonstrates how operational models (cloud-only operations) can make certain physical security controls irrelevant.

Even for not-applicable controls, we assign a Responsible Party (Facilities Manager) to establish who made the determination and who would be responsible if circumstances changed (e.g., if the organization began maintaining physical infrastructure).

## Verifying the SOA Summary

After documenting representative controls across all three categories, we return to the SOA summary at the top of the page. This summary now reflects our documentation work, showing:

- Total Controls: 93 (all Annex A controls)
- Applicable: 5 controls documented
- Partially Applicable: 1 control documented
- Not Applicable: 2 controls documented

In a complete SOA, every one of the 93 controls would be documented, but this demonstration shows the process and patterns for each category. The summary provides immediate visibility into SOA completion progress and helps ensure no controls are overlooked.

## The Value of the Statement of Applicability

The Statement of Applicability serves multiple critical purposes in the ISO 27001 implementation:

**Audit Evidence**: The SOA is the primary document auditors review to understand what controls the organization has implemented and why. Well-documented justifications make audits smoother and demonstrate thoughtful, risk-based decision-making.

**Implementation Roadmap**: The SOA, with its implementation statuses and target dates, becomes a practical roadmap for security improvements. It transforms the abstract Annex A controls into concrete, prioritized action items.

**Risk Treatment Documentation**: The SOA directly links to risk treatment decisions. When organizations decide to mitigate risks, the SOA documents which controls they will implement. This creates complete traceability from risk identification through control selection to implementation.

**Management Communication**: The SOA provides executives with a clear, comprehensive view of the organization's security control framework. They can see at a glance how many controls are implemented, how many are in progress, and what resources are needed for complete implementation.

**Scope Documentation**: By documenting which controls are not applicable and why, the SOA helps define ISMS boundaries and explains how the organization's unique context influences its security program.

**Continuous Improvement**: The SOA is not a static document—it should be reviewed and updated regularly as risks change, new technologies are adopted, or business processes evolve. The demonstration tool's automatic saving and version tracking support this ongoing maintenance.

## Demonstration Conclusion

The demonstration concludes with a comprehensive SOA that includes:

- 5 controls documented as Applicable with full justifications, implementation descriptions, responsible parties, and target dates
- 1 control documented as Partially Applicable with honest assessment of current limitations and improvement plans
- 2 controls documented as Not Applicable with clear justifications based on organizational context

All documented controls include the mandatory justification field and appropriate additional details, making them audit-ready. The systematic approach demonstrated here ensures that control applicability decisions are based on thorough analysis of the organization's risk profile, operational context, and business requirements rather than arbitrary choices.

With this SOA foundation in place, the organization can confidently proceed to the next stages of ISO 27001 implementation: developing detailed risk treatment plans, implementing the selected controls, conducting internal audits to verify effectiveness, and ultimately preparing for certification assessment. The SOA serves as the cornerstone document that guides all subsequent security activities and provides auditors with the evidence they need to verify compliance with ISO 27001:2022 requirements.
