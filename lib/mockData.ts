import {
  Grant,
  Application,
  User,
  Activity,
  ApplicationStatus,
  EvaluationQuestion,
} from "@/types";

// ─── Mock Users ───
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Rajesh Sharma",
    email: "rajesh@daanveda.org",
    role: "grant_manager",
    organization: "DaanVeda Foundation",
  },
  {
    id: "user-2",
    name: "Priya Menon",
    email: "priya@hopeinitiative.org",
    role: "ngo_user",
    organization: "Hope Initiative India",
  },
];

// ─── Evaluation Question Templates ───
const defaultQuestions: EvaluationQuestion[] = [
  {
    id: "eq-1",
    question: "Describe the organization's track record in the proposed focus area",
    responseType: "Textarea",
    maxScore: 10,
    weightage: 25,
  },
  {
    id: "eq-2",
    question: "What is the expected impact and how will it be measured?",
    responseType: "Textarea",
    maxScore: 10,
    weightage: 30,
  },
  {
    id: "eq-3",
    question: "Sustainability plan post grant period",
    responseType: "Textarea",
    maxScore: 10,
    weightage: 20,
  },
  {
    id: "eq-4",
    question: "Rate the organization's governance structure",
    responseType: "Rating",
    maxScore: 10,
    weightage: 25,
  },
];

// ─── Mock Grants ───
export const mockGrants: Grant[] = [
  {
    id: "grant-1",
    title: "Rural Education Enhancement Program",
    description:
      "Supporting NGOs working on improving primary education access and quality in rural India. Focus on teacher training, digital infrastructure, and curriculum development.",
    grantType: "CSR",
    fundName: "Tata Education Trust",
    fundType: "Project",
    totalAmount: 50000000,
    minAmount: 500000,
    maxAmount: 5000000,
    startDate: "2026-04-01",
    endDate: "2026-09-30",
    contactPerson: "Anita Desai",
    contactEmail: "anita@tataet.org",
    phone: "+91 98765 43210",
    geography: "National",
    country: "India",
    state: "",
    city: "",
    focusAreas: ["Education", "Child Welfare"],
    eligibilityCriteria:
      "Registered NGO with minimum 3 years of operations. Must have 80G and 12A registration. Prior experience in education projects preferred.",
    expectedOutcomes:
      "Improve learning outcomes for at least 5,000 students. Establish 20 digital classrooms. Train 200 teachers.",
    identifierType: "80G",
    evaluationQuestions: defaultQuestions,
    aiEvaluation: true,
    status: "Active",
    applications: 47,
    createdAt: "2026-03-01",
    funderName: "Tata Education Trust",
  },
  {
    id: "grant-2",
    title: "Women Empowerment & Livelihood Support",
    description:
      "Grant for organizations working towards women's economic empowerment through skill development, micro-enterprise support, and financial literacy programs.",
    grantType: "Foundation",
    fundName: "Azim Premji Foundation",
    fundType: "Capacity Building",
    totalAmount: 30000000,
    minAmount: 300000,
    maxAmount: 3000000,
    startDate: "2026-05-01",
    endDate: "2026-12-31",
    contactPerson: "Meera Kulkarni",
    contactEmail: "meera@azimpremji.org",
    phone: "+91 80 2678 1234",
    geography: "State",
    country: "India",
    state: "Karnataka",
    city: "",
    focusAreas: ["Women Empowerment", "Livelihood"],
    eligibilityCriteria:
      "Registered NGO with FCRA clearance. Minimum 5 years of experience in women empowerment programs. Demonstrated impact in previous projects.",
    expectedOutcomes:
      "Train 2,000 women in livelihood skills. Support 500 micro-enterprises. Achieve 70% income improvement for beneficiaries.",
    identifierType: "FCRA",
    evaluationQuestions: defaultQuestions,
    aiEvaluation: true,
    status: "Active",
    applications: 62,
    createdAt: "2026-02-15",
    funderName: "Azim Premji Foundation",
  },
  {
    id: "grant-3",
    title: "Clean Water & Sanitation Initiative",
    description:
      "Funding for NGOs implementing clean water access and sanitation infrastructure projects in underserved communities across India.",
    grantType: "Government",
    fundName: "Swachh Bharat Mission",
    fundType: "Project",
    totalAmount: 75000000,
    minAmount: 1000000,
    maxAmount: 10000000,
    startDate: "2026-06-01",
    endDate: "2027-05-31",
    contactPerson: "Vikram Singh",
    contactEmail: "vikram@sbm.gov.in",
    phone: "+91 11 2301 5678",
    geography: "National",
    country: "India",
    state: "",
    city: "",
    focusAreas: ["Health", "Environment"],
    eligibilityCriteria:
      "NGOs with at least 5 years of experience in WASH projects. Must have completed at least 2 government-funded projects. Valid DARPAN registration required.",
    expectedOutcomes:
      "Provide clean water access to 50,000 households. Build 1,000 community toilets. Reduce waterborne diseases by 40%.",
    identifierType: "NGO Reg No.",
    evaluationQuestions: defaultQuestions,
    aiEvaluation: false,
    status: "Active",
    applications: 89,
    createdAt: "2026-01-10",
    funderName: "Ministry of Jal Shakti",
  },
  {
    id: "grant-4",
    title: "Healthcare Access for Tribal Communities",
    description:
      "Supporting healthcare delivery, telemedicine, and health worker training programs in tribal areas of central India.",
    grantType: "Corporate",
    fundName: "Infosys Foundation",
    fundType: "Operational",
    totalAmount: 25000000,
    minAmount: 200000,
    maxAmount: 2500000,
    startDate: "2026-04-15",
    endDate: "2026-10-15",
    contactPerson: "Dr. Sunita Rao",
    contactEmail: "sunita@infosysfoundation.org",
    phone: "+91 80 4116 7890",
    geography: "State",
    country: "India",
    state: "Madhya Pradesh",
    city: "",
    focusAreas: ["Health", "Disability"],
    eligibilityCriteria:
      "Experience working in tribal areas. Medical or health-focused NGO with registered doctors/nurses. Prior partnership with district health authorities.",
    expectedOutcomes:
      "Set up 15 telemedicine centers. Train 100 community health workers. Provide healthcare to 25,000 tribal population.",
    identifierType: "PAN",
    evaluationQuestions: defaultQuestions,
    aiEvaluation: true,
    status: "Active",
    applications: 34,
    createdAt: "2026-03-15",
    funderName: "Infosys Foundation",
  },
  {
    id: "grant-5",
    title: "Climate Action & Green Energy Fund",
    description:
      "Funding for organizations promoting renewable energy adoption, climate resilience, and environmental conservation at community level.",
    grantType: "Bilateral",
    fundName: "Indo-German Green Fund",
    fundType: "Seed",
    totalAmount: 100000000,
    minAmount: 2000000,
    maxAmount: 15000000,
    startDate: "2026-07-01",
    endDate: "2027-06-30",
    contactPerson: "Klaus Mueller",
    contactEmail: "klaus@iggf.org",
    phone: "+91 11 2419 8765",
    geography: "National",
    country: "India",
    state: "",
    city: "",
    focusAreas: ["Environment"],
    eligibilityCriteria:
      "NGOs/Social enterprises with demonstrated expertise in renewable energy or climate projects. Minimum project proposal value of ₹20 lakhs.",
    expectedOutcomes:
      "Install 500 solar units in rural areas. Plant 100,000 trees. Reduce carbon footprint by 5,000 tonnes annually.",
    identifierType: "CSR-1",
    evaluationQuestions: defaultQuestions,
    aiEvaluation: true,
    status: "Draft",
    applications: 0,
    createdAt: "2026-04-01",
    funderName: "Indo-German Development Agency",
  },
  {
    id: "grant-6",
    title: "Disaster Relief & Rehabilitation Fund",
    description:
      "Emergency funding for NGOs providing disaster relief, rehabilitation, and community rebuilding in disaster-affected regions.",
    grantType: "Foundation",
    fundName: "HDFC Foundation",
    fundType: "Project",
    totalAmount: 40000000,
    minAmount: 500000,
    maxAmount: 5000000,
    startDate: "2026-03-01",
    endDate: "2026-06-30",
    contactPerson: "Arun Joshi",
    contactEmail: "arun@hdfcfoundation.org",
    phone: "+91 22 6786 5432",
    geography: "State",
    country: "India",
    state: "Assam",
    city: "",
    focusAreas: ["Disaster Relief", "Health"],
    eligibilityCriteria:
      "NGOs with proven disaster relief experience. Quick deployment capability. Existing presence in flood-affected areas of Assam.",
    expectedOutcomes:
      "Provide immediate relief to 10,000 families. Rebuild 500 homes. Restore 20 schools and health centers.",
    identifierType: "80G",
    evaluationQuestions: defaultQuestions,
    aiEvaluation: false,
    status: "Closed",
    applications: 15,
    createdAt: "2026-01-15",
    funderName: "HDFC Foundation",
  },
];

// ─── Mock NGO Names ───
const ngoNames = [
  "Pratham Education Foundation",
  "Akshaya Patra Foundation",
  "Goonj",
  "Teach For India",
  "CRY - Child Rights and You",
  "Smile Foundation",
  "Magic Bus India Foundation",
  "Barefoot College",
  "SEWA (Self Employed Women's Association)",
  "iVolunteer",
  "Udayan Care",
  "Breakthrough India",
  "Room to Read India",
  "ActionAid India",
  "SOS Children's Villages India",
  "Seva Mandir",
  "Piramal Foundation",
  "Quest Alliance",
  "Vikramshila Education Resource Society",
  "Navjyoti India Foundation",
];

const locations = [
  "Mumbai, Maharashtra",
  "New Delhi",
  "Bengaluru, Karnataka",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Bhopal, Madhya Pradesh",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
];

const projectTitles = [
  "Digital Literacy for Rural Schools",
  "Women's Skill Development Center",
  "Community Health Worker Training",
  "Solar Energy for Villages",
  "Clean Water Access Program",
  "Child Nutrition & Education",
  "Post-Flood Rehabilitation",
  "Tribal Healthcare Outreach",
  "Environmental Conservation Drive",
  "Youth Entrepreneurship Hub",
  "Mobile Health Clinics",
  "Girls' Education Initiative",
  "Vocational Training for Youth",
  "Community Water Purification",
  "Disaster Preparedness Training",
  "Organic Farming Support",
  "Women's Self-Help Groups",
  "Mental Health Awareness",
  "School Infrastructure Upgrade",
  "Rural Livelihood Program",
];

const statuses: ApplicationStatus[] = [
  "Submitted",
  "Submitted",
  "Submitted",
  "Submitted",
  "Submitted",
  "Submitted",
  "Submitted",
  "Submitted",
  "In Review",
  "In Review",
  "In Review",
  "In Review",
  "In Review",
  "Shortlisted",
  "Shortlisted",
  "Shortlisted",
  "Approved",
  "Approved",
  "Rejected",
  "Rejected",
];

function generateApplications(): Application[] {
  const grantIds = mockGrants
    .filter((g) => g.status !== "Draft")
    .map((g) => g.id);

  return Array.from({ length: 20 }, (_, i) => {
    const grantId = grantIds[i % grantIds.length];
    const grant = mockGrants.find((g) => g.id === grantId)!;
    const totalBudget = Math.floor(
      Math.random() * (grant.maxAmount - grant.minAmount) + grant.minAmount
    );

    return {
      id: `app-${i + 1}`,
      grantId,
      grantTitle: grant.title,
      ngoName: ngoNames[i],
      ngoRegistration: `NGO-${String(Math.floor(Math.random() * 900000 + 100000))}`,
      ngoLocation: locations[i % locations.length],
      ngoContact: `+91 ${String(Math.floor(Math.random() * 9000000000 + 1000000000))}`,
      ngoEmail: `${ngoNames[i].toLowerCase().replace(/[^a-z]/g, "").slice(0, 10)}@ngo.org`,
      projectTitle: projectTitles[i],
      projectDescription: `This project aims to ${projectTitles[i].toLowerCase()} in underserved communities. Our organization has been working in this area for over ${Math.floor(Math.random() * 10 + 3)} years with proven results.`,
      targetBeneficiaries: Math.floor(Math.random() * 10000 + 500),
      implementationTimeline: `${Math.floor(Math.random() * 12 + 6)} months`,
      budgetItems: [
        {
          id: `bi-${i}-1`,
          category: "Personnel",
          amount: Math.floor(totalBudget * 0.35),
          description: "Project staff salaries and benefits",
        },
        {
          id: `bi-${i}-2`,
          category: "Equipment",
          amount: Math.floor(totalBudget * 0.25),
          description: "Equipment and supplies procurement",
        },
        {
          id: `bi-${i}-3`,
          category: "Training",
          amount: Math.floor(totalBudget * 0.2),
          description: "Training and capacity building",
        },
        {
          id: `bi-${i}-4`,
          category: "Operations",
          amount: Math.floor(totalBudget * 0.15),
          description: "Operations and logistics",
        },
        {
          id: `bi-${i}-5`,
          category: "Monitoring",
          amount: Math.floor(totalBudget * 0.05),
          description: "Monitoring and evaluation",
        },
      ],
      totalBudget,
      evaluationResponses: defaultQuestions.map((q) => ({
        questionId: q.id,
        question: q.question,
        answer: `Our organization has extensive experience in this area. We have successfully implemented similar projects reaching over ${Math.floor(Math.random() * 5000 + 1000)} beneficiaries across ${Math.floor(Math.random() * 5 + 2)} states.`,
      })),
      documents: [
        {
          name: "Registration Certificate",
          status: "Uploaded" as const,
          fileName: "registration_cert.pdf",
        },
        {
          name: "Annual Report",
          status: "Uploaded" as const,
          fileName: "annual_report_2025.pdf",
        },
        {
          name: "Project Plan",
          status: i % 3 === 0 ? ("Pending" as const) : ("Uploaded" as const),
          fileName: i % 3 === 0 ? undefined : "project_plan.pdf",
        },
        {
          name: "Budget Document",
          status: "Uploaded" as const,
          fileName: "budget_detail.xlsx",
        },
      ],
      status: statuses[i],
      score: Math.floor(Math.random() * 40 + 60),
      submittedAt: new Date(
        2026,
        2,
        Math.floor(Math.random() * 28) + 1
      ).toISOString(),
      notes: [],
    };
  });
}

// ─── Mock Activities ───
export const mockActivities: Activity[] = [
  {
    id: "act-1",
    type: "application_received",
    message: "New application from Pratham Education Foundation for Rural Education Enhancement Program",
    timestamp: new Date(2026, 3, 7, 10, 30).toISOString(),
  },
  {
    id: "act-2",
    type: "status_change",
    message: "Akshaya Patra Foundation moved to Shortlisted for Women Empowerment grant",
    timestamp: new Date(2026, 3, 7, 9, 15).toISOString(),
  },
  {
    id: "act-3",
    type: "grant_published",
    message: "Clean Water & Sanitation Initiative published and accepting applications",
    timestamp: new Date(2026, 3, 6, 16, 0).toISOString(),
  },
  {
    id: "act-4",
    type: "application_received",
    message: "New application from Goonj for Disaster Relief & Rehabilitation Fund",
    timestamp: new Date(2026, 3, 6, 14, 20).toISOString(),
  },
  {
    id: "act-5",
    type: "status_change",
    message: "Teach For India application Approved for Rural Education Enhancement Program",
    timestamp: new Date(2026, 3, 6, 11, 45).toISOString(),
  },
  {
    id: "act-6",
    type: "note_added",
    message: "Note added to CRY application: 'Strong governance structure, recommend for final review'",
    timestamp: new Date(2026, 3, 5, 17, 30).toISOString(),
  },
  {
    id: "act-7",
    type: "application_received",
    message: "3 new applications received for Healthcare Access for Tribal Communities",
    timestamp: new Date(2026, 3, 5, 12, 0).toISOString(),
  },
  {
    id: "act-8",
    type: "status_change",
    message: "Smile Foundation moved to In Review for Women Empowerment grant",
    timestamp: new Date(2026, 3, 5, 9, 30).toISOString(),
  },
];

export const mockApplications = generateApplications();
