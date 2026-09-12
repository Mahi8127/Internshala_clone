import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    fontFamily: "Helvetica",
  },
  // Left Sidebar Styling
  leftColumn: {
    width: "33%",
    backgroundColor: "#0f172a", // Slate 900
    color: "#FFFFFF",

    padding: 20,
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  photoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#64748b",
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarHeading: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#94a3b8",
    paddingBottom: 4,
    marginBottom: 10,
    color: "#FFFFFF",
  },
  contactText: {
    fontSize: 8.5,
    color: "#e2e8f0",
    marginBottom: 4,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    fontSize: 8,
    color: "#FFFFFF",
    marginBottom: 5,
    marginRight: 4,
  },
  listItemText: {
    fontSize: 8.5,
    color: "#e2e8f0",
    marginBottom: 3,
  },

  // Right Content Area Styling
  rightColumn: {
    width: "67%",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  headerSection: {
    marginBottom: 18,
  },
  fullName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  headerBar: {
    height: 3,
    backgroundColor: "#2563eb", // Blue 600
    width: 70,
    marginTop: 6,
    borderRadius: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e293b",
    borderBottomWidth: 1.5,
    borderBottomColor: "#2563eb",
    paddingBottom: 3,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 9,
    color: "#334155",
    lineHeight: 1.35,
  },
  entryContainer: {
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#3b82f6", // Blue 500
  },
  entryTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  entrySubtitle: {
    fontSize: 9,
    color: "#334155",
    marginBottom: 2,
  },
  entryDates: {
    fontSize: 8,
    color: "#64748b",
    marginBottom: 2,
  },
  boldLabel: {
    fontWeight: "bold",
  },
});

const ResumeDocument = ({ resume }: { resume: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* LEFT SIDEBAR */}
      <View style={styles.leftColumn}>
        {/* Profile Image */}
        <View style={styles.photoContainer}>
          {resume.photo ? (
            <Image style={styles.photo} src={resume.photo} />
          ) : (
            <View style={styles.photoPlaceholder} />
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarHeading}>Contact</Text>
          {resume.email && (
            <Text style={styles.contactText}>{resume.email}</Text>
          )}
          {resume.phone && (
            <Text style={styles.contactText}>{resume.phone}</Text>
          )}
          {resume.address && (
            <Text style={styles.contactText}>{resume.address}</Text>
          )}
          {resume.linkedin && (
            <Text style={styles.contactText}>{resume.linkedin}</Text>
          )}
          {resume.github && (
            <Text style={styles.contactText}>{resume.github}</Text>
          )}
          {resume.portfolio && (
            <Text style={styles.contactText}>{resume.portfolio}</Text>
          )}
        </View>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>Skills</Text>
            <View style={styles.skillsContainer}>
              {resume.skills.map((skill: any, i: any) => (
                <Text key={i} style={styles.skillBadge}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {resume.languages && resume.languages.length > 0 && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>Languages</Text>
            {resume.languages.map((lang: any, i: any) => (
              <Text key={i} style={styles.listItemText}>
                • {lang}
              </Text>
            ))}
          </View>
        )}

        {/* Interests */}
        {resume.interests && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>Interests</Text>

            {resume.interests.split(",").map((interest: string, i: number) => (
              <Text key={i} style={styles.listItemText}>
                • {interest.trim()}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* RIGHT MAIN CONTENT */}
      <View style={styles.rightColumn}>
        {/* Full Name */}
        <View style={styles.headerSection}>
          <Text style={styles.fullName}>{resume.fullname}</Text>
          <View style={styles.headerBar} />
        </View>

        {/* Career Objective */}
        {resume.objective && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Career Objective</Text>
            <Text style={styles.bodyText}>{resume.objective}</Text>
          </View>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Education</Text>
            {resume.education.map((edu: any, index: any) => (
              <View key={index} style={styles.entryContainer}>
                <Text style={styles.entryTitle}>{edu.college}</Text>
                {edu.degree && (
                  <Text style={styles.entrySubtitle}>{edu.degree}</Text>
                )}
                {edu.branch && (
                  <Text style={styles.entrySubtitle}>{edu.branch}</Text>
                )}
                {edu.cgpa && (
                  <Text style={styles.entrySubtitle}>CGPA: {edu.cgpa}</Text>
                )}
                {(edu.startYear || edu.endYear) && (
                  <Text style={styles.entryDates}>
                    {edu.startYear} - {edu.endYear}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Experience</Text>
            {resume.experience.map((exp: any, index: any) => (
              <View key={index} style={styles.entryContainer}>
                <Text style={styles.entryTitle}>{exp.company}</Text>
                {exp.position && (
                  <Text style={styles.entrySubtitle}>{exp.position}</Text>
                )}
                {exp.duration && (
                  <Text style={styles.entryDates}>{exp.duration}</Text>
                )}
                {exp.description && (
                  <Text style={styles.bodyText}>{exp.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Projects</Text>
            {resume.projects.map((proj: any, index: any) => (
              <View key={index} style={styles.entryContainer}>
                <Text style={styles.entryTitle}>{proj.title}</Text>
                {proj.description && (
                  <Text style={styles.bodyText}>{proj.description}</Text>
                )}
                {proj.github && (
                  <Text style={styles.entryDates}>{proj.github}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {resume.certification && resume.certification.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Certifications</Text>
            {resume.certification.map((cert: any, i: any) => (
              <Text key={i} style={styles.bodyText}>
                • {cert}
              </Text>
            ))}
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export default ResumeDocument;
