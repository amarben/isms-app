# Risk Assessment Demonstration - Simple Narrative Guide

## Introduction

This demonstration showcases a streamlined Risk Assessment process for ISO 27001 compliance. Through an intuitive four-step wizard, organizations can systematically identify assets, analyze threats and vulnerabilities, evaluate risks, and define treatment strategies. This workflow ensures comprehensive risk management while maintaining alignment with ISO 27001:2022 requirements and industry best practices, specifically addressing Clause 6.1.2 (Information Security Risk Assessment) and Clause 8.2 (Information Security Risk Assessment).

## The Journey Begins

The demonstration begins by accessing the ISMS Dashboard, which serves as the central hub for managing the organization's ISO 27001 implementation. This dashboard provides a comprehensive overview of the implementation journey, displaying progress across all major stages including scope definition, policy creation, risk assessment, control implementation, and audit readiness. The clean, intuitive interface immediately gives users insight into their current status and highlights areas requiring attention.

From the dashboard, we navigate to the "Risk Assessment" section through the left sidebar navigation. This action initiates the risk assessment workflow, a critical requirement for ISO 27001 compliance. Risk assessment is the foundation upon which all security controls and treatment decisions are built. The process is deliberately structured as a four-step wizard, guiding organizations through the systematic analysis required to identify, evaluate, and manage information security risks. Each step builds upon the previous one, ensuring that risk management decisions are based on thorough understanding rather than assumptions.

## Establishing Assessment Context

The first step centers on configuring the assessment setup and defining the organizational context for risk evaluation. We begin by documenting essential organizational details, starting with the organization name "TechCorp Solutions Ltd." This information will appear throughout all generated documentation and establishes the specific organizational context for the risk assessment. The organization name is particularly important as it identifies who owns the risks and who is responsible for managing them—a key requirement for accountability in ISO 27001.

Next, we set the assessment date to October 21, 2025, marking when this risk assessment is being conducted. Dating the assessment is crucial for several reasons: it establishes a baseline for comparison in future assessments, it demonstrates ongoing risk management activities to auditors, and it helps track the evolution of the organization's risk profile over time. ISO 27001 Clause 9.3 requires regular management review of the ISMS, and dated risk assessments provide objective evidence of continuous risk monitoring.

We designate "Information Security Team" as the assessor, identifying who is conducting this risk assessment. The assessor field is important because it establishes expertise and authority—the people performing risk assessments must have adequate competence to identify threats, evaluate vulnerabilities, and assess the likelihood and impact of security incidents. This aligns with ISO 27001 Clause 7.2 (Competence) which requires organizations to ensure that persons doing work under the organization's control have appropriate competence.

The methodology is set to "qualitative," indicating that we will assess risks using descriptive scales (such as "low," "medium," "high") rather than precise numerical calculations. Qualitative risk assessment is appropriate for most organizations and aligns with ISO 27001's risk-based approach. While the standard doesn't mandate a specific methodology, it requires that the chosen approach produce comparable and reproducible results. Qualitative assessments are particularly effective when precise data about threat frequencies and incident impacts is unavailable, which is common in information security.

Finally, we define the scope as "All information systems and data processing activities within the ISMS scope, including customer data, cloud infrastructure, and business applications." This scope statement ensures that the risk assessment covers all assets and processes that fall within the Information Security Management System boundaries. The scope should align with the ISMS scope defined earlier in the implementation process, ensuring consistency across all documentation. By explicitly stating what is included—customer data, cloud infrastructure, and business applications—we establish clear boundaries for the assessment and ensure that all critical assets are evaluated.

## Identifying Critical Assets

The second step involves identifying and classifying the organization's information assets. Asset identification is the foundation of risk assessment because you cannot protect what you haven't identified. ISO 27001 Annex A.5.9 specifically requires an inventory of information and other associated assets, making this step essential for compliance.

We begin by selecting critical assets from a predefined library that covers common organizational assets. This approach accelerates the assessment process while ensuring that important asset categories aren't overlooked. For this demonstration, we identify four key assets that represent different aspects of the organization's information infrastructure:

**Customer Database** - This is typically one of the most critical information assets in any organization. It contains personal data, financial information, transaction histories, and customer communications. The loss, theft, or unauthorized disclosure of this data could result in severe consequences including regulatory fines (under GDPR, for instance), loss of customer trust, reputational damage, and potential legal liability. The classification of this asset would typically be "Confidential" or "Restricted," and its value would be assessed as "Critical" given the significant impact of any security incident affecting it.

**Financial Records** - These assets include accounting data, financial statements, budget information, tax records, and payment processing data. Financial records are subject to numerous regulatory requirements (such as SOX for publicly traded companies, tax regulations, and accounting standards), making their protection both a security and compliance imperative. Unauthorized access or manipulation of financial data could lead to fraud, misstatements, regulatory violations, and loss of stakeholder confidence. The integrity of financial records is particularly important, as inaccurate or tampered data can have severe legal and business consequences.

**Email System** - Email is a critical communication and collaboration tool that processes sensitive business information daily. It contains confidential communications, contracts, strategic discussions, customer correspondence, and often serves as a repository for file attachments. Compromise of the email system could lead to data breaches, business email compromise (BEC) attacks, loss of confidential information, and disruption of business operations. The availability of email is also critical, as extended outages can significantly impact business productivity and customer service.

**Web Application** - This represents the customer-facing application that provides online services, processes transactions, and interfaces with backend systems. The web application is often the primary attack surface for external threats and must handle authentication, authorization, data validation, and secure communication. Vulnerabilities in web applications can lead to SQL injection, cross-site scripting (XSS), authentication bypass, and other serious security incidents. The availability, integrity, and confidentiality of the web application are all critical to business operations and customer trust.

Each of these assets is documented with key attributes including asset type (information, physical, software, or human), classification level (public, internal, confidential, or restricted), asset owner (the person or department responsible for the asset), and business value (low, medium, high, or critical). This metadata is essential for risk analysis because it helps determine the potential impact of security incidents and prioritize protection efforts.

## Analyzing Risks and Vulnerabilities

The third step focuses on risk analysis—the systematic process of identifying threats, evaluating vulnerabilities, and assessing the likelihood and impact of potential security incidents. This is the core of the risk assessment process and directly fulfills ISO 27001 Clause 6.1.2 requirements for information security risk assessment.

Risk analysis involves examining each asset to identify: what threats could affect it (threat identification), what vulnerabilities make the asset susceptible to those threats (vulnerability assessment), how likely it is that the threat will exploit the vulnerability (likelihood assessment), and what the consequences would be if the threat succeeds (impact assessment).

For this demonstration, we create a sample risk assessment that shows the complete process. The system guides us through selecting an asset, identifying applicable threats from a comprehensive threat library, assessing relevant vulnerabilities, and evaluating both likelihood and impact using standardized scales.

**Threat Identification**: The threat library includes common categories such as external threats (malware attacks, phishing, DDoS attacks, unauthorized access attempts), internal threats (data theft by insiders, accidental deletion, policy violations), and environmental threats (power outages, hardware failures, natural disasters). Each threat is characterized by its source (who or what could cause it) and type (external, internal, or environmental). This categorization helps organizations understand their threat landscape and prioritize security investments.

**Vulnerability Assessment**: For each asset-threat combination, we evaluate what vulnerabilities could be exploited. Vulnerabilities might include technical weaknesses (missing security patches, weak access controls, lack of encryption), procedural gaps (insufficient training, inadequate backup procedures, poor change management), or physical security deficiencies (inadequate facility access controls, lack of environmental monitoring). The vulnerability assessment considers both current controls and their effectiveness—a control that exists but is poorly implemented still represents a vulnerability.

**Likelihood and Impact Evaluation**: The risk analysis uses a standardized scale to assess likelihood and impact:

Likelihood levels range from "Very Low" (rare occurrence, less than 1% probability) to "Very High" (almost certain, greater than 75% probability). Likelihood assessment considers factors such as: the motivation and capability of threat actors, the attractiveness of the target, the effectiveness of existing controls, historical incident data, and industry threat intelligence.

Impact levels range from "Very Low" (negligible impact on operations, finances, or reputation) to "Very High" (severe or catastrophic impact that could threaten the organization's viability). Impact assessment considers: financial losses from incident response, recovery, and potential fines; operational disruption and downtime; reputational damage and loss of customer confidence; legal and regulatory consequences; and strategic impact on business objectives.

The combination of likelihood and impact produces an overall risk level using a risk matrix: Very Low (1-4), Low (5-8), Medium (9-12), High (13-16), and Very High (17-25). This risk level determines treatment priority and helps management understand which risks require immediate attention and which can be accepted or monitored.

**Documenting Existing Controls**: A critical component of risk analysis is documenting the security controls already in place. Before assessing the likelihood and impact of risks, organizations must identify what protective measures currently exist. This baseline understanding is essential because existing controls directly influence both the probability that a threat will succeed and the potential impact if it does.

For each risk being assessed, the system provides a dedicated field for documenting existing controls. These controls represent the current security posture and may include technical safeguards, procedural measures, physical protections, or organizational policies already implemented. Properly documenting existing controls serves several important purposes: it provides evidence of due diligence to auditors, it helps assess residual risk accurately, it identifies control gaps that need to be addressed, and it prevents redundant control implementation.

In this demonstration, we systematically analyze all four identified assets, ensuring comprehensive risk coverage:

**Customer Database - First Risk**: For a high-likelihood, high-impact threat scenario, we document existing controls including "Database encryption at rest" (protecting data confidentiality even if storage media is compromised), "Access control lists (ACLs)" (restricting who can access the database), "Regular security audits" (ensuring ongoing compliance and identifying vulnerabilities), and "Intrusion detection system (IDS)" (monitoring for unauthorized access attempts). These controls demonstrate a layered security approach but the remaining risk still warrants attention.

**Customer Database - Second Risk**: For another threat scenario with medium likelihood and high impact, we document controls such as "Multi-factor authentication" (preventing unauthorized access even with compromised credentials), "Data backup and recovery" (ensuring business continuity and data availability), and "Security awareness training" (reducing human error and insider threats). Multiple risks for the same asset are common because different threats exploit different vulnerabilities and require different defensive strategies.

**Financial Records**: Assessing a low-likelihood but very-high-impact risk, we document "Financial data encryption" (protecting sensitive financial information in transit and at rest), "Access logging and monitoring" (creating audit trails and enabling incident detection), and "Regular compliance audits" (ensuring adherence to financial regulations and internal policies). The very high impact rating reflects the severe regulatory and business consequences of financial data compromise, even though likelihood may be relatively low due to existing controls.

**Email System**: For a high-likelihood, medium-impact scenario, existing controls include "Email encryption (TLS/SSL)" (protecting messages in transit), "Spam and malware filtering" (blocking malicious content before it reaches users), and "Email authentication (SPF, DKIM, DMARC)" (preventing email spoofing and phishing attacks). Email systems face constant threats, making the likelihood high, but robust controls can limit the potential impact.

**Web Application**: Analyzing a medium-likelihood, high-impact risk, we document "Web application firewall (WAF)" (filtering malicious HTTP traffic), "Secure coding practices" (preventing vulnerabilities during development), "Regular vulnerability scanning" (identifying weaknesses before attackers do), and "Input validation and sanitization" (preventing injection attacks and data corruption). Web applications represent a critical attack surface and require comprehensive security measures across multiple layers.

## Defining Risk Treatment Strategies

The fourth and final step involves reviewing risk treatment options and documenting how the organization will address each identified risk. ISO 27001 Clause 6.1.3 requires organizations to define and apply an information security risk treatment process, and Clause 8.3 requires implementing the risk treatment plan.

For each risk, organizations must select one of four treatment strategies:

**Risk Mitigation** - Implementing controls to reduce the likelihood or impact of the risk to an acceptable level. This is the most common treatment strategy and involves deploying technical controls (firewalls, encryption, access controls), procedural controls (policies, training, incident response procedures), or physical controls (locks, surveillance, environmental controls). Mitigation doesn't eliminate the risk entirely but reduces it to a level that management is willing to accept. The residual risk after mitigation must be explicitly documented and approved.

**Risk Avoidance** - Eliminating the risk by changing business processes, discontinuing certain activities, or removing the source of risk. For example, an organization might avoid the risks associated with processing credit card data by using a third-party payment processor instead. Risk avoidance is appropriate when the cost of mitigation exceeds the value of the activity or when the risk is simply too high to accept.

**Risk Transfer** - Sharing the risk with third parties through insurance, outsourcing, or contractual agreements. Cyber insurance can transfer the financial impact of certain incidents, while outsourcing can transfer operational risks to service providers with greater expertise or resources. However, risk transfer doesn't eliminate the organization's ultimate responsibility for protecting information—it simply shifts some of the consequences.

**Risk Acceptance** - Explicitly acknowledging and accepting the risk without further treatment. This is appropriate for low-level risks where the cost of mitigation exceeds the potential impact, or for residual risks that remain after implementing other treatment strategies. Risk acceptance must be documented and formally approved by management with appropriate authority—this demonstrates informed decision-making and helps protect against claims of negligence.

For each treatment decision, we document: the selected treatment strategy, specific controls to be implemented (for mitigation), the person or department responsible for implementation, target completion dates, and residual risk levels after treatment. This treatment plan becomes the roadmap for implementing ISO 27001 Annex A controls and forms the basis for the Statement of Applicability (SOA).

The demonstration concludes with the completion of comprehensive risk analysis for all identified assets. At this point, the organization has systematically identified four critical information assets (Customer Database, Financial Records, Email System, and Web Application), analyzed five distinct security risks across these assets, documented existing controls for each risk scenario, and evaluated likelihood and impact using standardized criteria. All data is automatically saved to local storage, ensuring that progress is preserved and can be reviewed or updated at any time. This comprehensive risk assessment—covering 100% of identified assets with detailed control documentation—provides the foundation for the next critical steps in ISO 27001 implementation:

- Creating the Statement of Applicability (SOA) based on selected controls
- Developing detailed Risk Treatment Plans with timelines and responsibilities
- Implementing the selected security controls
- Monitoring and reviewing risks on an ongoing basis
- Demonstrating to auditors that risks are managed systematically

## Conclusion

This streamlined demonstration illustrates how the Risk Assessment workflow transforms a complex ISO 27001 requirement into a manageable, step-by-step process. By guiding organizations through systematic asset identification, threat and vulnerability analysis, existing control documentation, risk evaluation, and treatment planning, the tool ensures that nothing is overlooked and that all decisions are properly documented and justified.

The demonstration showcases complete asset coverage—all four identified assets have undergone thorough risk analysis with detailed documentation of existing controls. This comprehensive approach is essential for ISO 27001 compliance because it demonstrates that the organization has systematically considered risks across its entire ISMS scope rather than focusing on isolated areas. The documentation of existing controls is particularly valuable as it provides auditors with evidence of the organization's current security posture and forms the baseline for measuring improvement over time.

The result is a comprehensive risk assessment that meets ISO 27001 requirements, provides clear direction for control implementation, and establishes a solid foundation for ongoing risk management. With this assessment in place—covering all critical assets with detailed control inventories—the organization can proceed confidently to implement additional security controls, knowing that their security program is built on a thorough understanding of their risk landscape, acknowledges existing protective measures, and addresses the most significant threats to their information assets.

Risk assessment is not a one-time activity—it must be performed at planned intervals and whenever significant changes occur (Clause 6.1.2.c). This tool facilitates that ongoing process by preserving assessment data, tracking changes over time, and enabling organizations to update their risk profiles as their business, technology, and threat landscape evolve. The systematic approach demonstrated here ensures that risk assessment remains a living process that continuously informs and improves the organization's information security posture.
