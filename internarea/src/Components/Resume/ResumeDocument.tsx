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
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#1e293b",
  },

  /* =========================
     LEFT SIDEBAR
  ========================= */

  leftColumn: {
    width: "31%",
    backgroundColor: "#111827",
    paddingTop: 26,
    paddingBottom: 24,
    paddingHorizontal: 20,
    color: "#ffffff",
  },

  photoContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  photo: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: "#ffffff",
  },

  photoPlaceholder: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#475569",
    borderWidth: 3,
    borderColor: "#ffffff",
  },

  sidebarSection: {
    marginBottom: 22,
  },

  sidebarHeading: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#ffffff",
    paddingBottom: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#475569",
  },

  contactText: {
    fontSize: 8.5,
    color: "#e5e7eb",
    lineHeight: 1.35,
    marginBottom: 6,
  },

  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  skillBadge: {
    backgroundColor: "#1e3a5f",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 7,
    fontSize: 7.8,
    color: "#ffffff",
    marginBottom: 5,
    marginRight: 4,
  },

  listItemText: {
    fontSize: 8.5,
    color: "#e5e7eb",
    lineHeight: 1.4,
    marginBottom: 5,
  },

  /* =========================
     RIGHT CONTENT
  ========================= */

  rightColumn: {
    width: "69%",
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 26,
    backgroundColor: "#ffffff",
  },

  headerSection: {
    marginBottom: 20,
  },

  fullName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    letterSpacing: -0.5,
  },

  headerBar: {
    height: 3,
    backgroundColor: "#2563eb",
    width: 65,
    marginTop: 7,
    borderRadius: 2,
  },

  section: {
    marginBottom: 17,
  },

  sectionHeading: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    paddingBottom: 4,
    marginBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#dbeafe",
  },

  bodyText: {
    fontSize: 8.8,
    color: "#374151",
    lineHeight: 1.45,
  },

  entryContainer: {
    marginBottom: 10,
    paddingLeft: 9,
    borderLeftWidth: 2.5,
    borderLeftColor: "#2563eb",
  },

  entryTitle: {
    fontSize: 9.8,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 3,
  },

  entrySubtitle: {
    fontSize: 8.7,
    color: "#374151",
    lineHeight: 1.3,
    marginBottom: 2,
  },

  entryDates: {
    fontSize: 7.8,
    color: "#64748b",
    marginBottom: 3,
  },

  bulletText: {
    fontSize: 8.7,
    color: "#374151",
    lineHeight: 1.4,
    marginBottom: 4,
  },
});

const ResumeDocument = ({ resume }: { resume: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* ==================================================
          LEFT SIDEBAR
      ================================================== */}

      <View style={styles.leftColumn}>
        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          {resume.photo ? (
            <Image style={styles.photo} src={resume.photo} />
          ) : (
            <View style={styles.photoPlaceholder} />
          )}
        </View>

        {/* Contact */}
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarHeading}>Contact</Text>

          {resume.email && (
            <Text style={styles.contactText}>
              {resume.email}
            </Text>
          )}

          {resume.phone && (
            <Text style={styles.contactText}>
              {resume.phone}
            </Text>
          )}

          {resume.address && (
            <Text style={styles.contactText}>
              {resume.address}
            </Text>
          )}

          {resume.linkedin && (
            <Text style={styles.contactText}>
              {resume.linkedin}
            </Text>
          )}

          {resume.github && (
            <Text style={styles.contactText}>
              {resume.github}
            </Text>
          )}

          {resume.portfolio && (
            <Text style={styles.contactText}>
              {resume.portfolio}
            </Text>
          )}
        </View>

        {/* Skills */}
        {Array.isArray(resume.skills) &&
          resume.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>
                Skills
              </Text>

              <View style={styles.skillsContainer}>
                {resume.skills.map(
                  (skill: any, index: number) => (
                    <Text
                      key={index}
                      style={styles.skillBadge}
                    >
                      {skill}
                    </Text>
                  )
                )}
              </View>
            </View>
          )}

        {/* Languages */}
        {Array.isArray(resume.languages) &&
          resume.languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarHeading}>
                Languages
              </Text>

              {resume.languages.map(
                (lang: any, index: number) => (
                  <Text
                    key={index}
                    style={styles.listItemText}
                  >
                    • {lang}
                  </Text>
                )
              )}
            </View>
          )}

        {/* Interests */}
        {resume.interests && (
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarHeading}>
              Interests
            </Text>

            {String(resume.interests)
              .split(",")
              .map(
                (interest: string, index: number) => (
                  <Text
                    key={index}
                    style={styles.listItemText}
                  >
                    • {interest.trim()}
                  </Text>
                )
              )}
          </View>
        )}
      </View>

      {/* ==================================================
          RIGHT MAIN CONTENT
      ================================================== */}

      <View style={styles.rightColumn}>
        {/* Name */}
        <View style={styles.headerSection}>
          <Text style={styles.fullName}>
            {resume.fullname || "Your Name"}
          </Text>

          <View style={styles.headerBar} />
        </View>

        {/* Career Objective */}
        {resume.objective && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>
              Career Objective
            </Text>

            <Text style={styles.bodyText}>
              {resume.objective}
            </Text>
          </View>
        )}

        {/* Education */}
        {Array.isArray(resume.education) &&
          resume.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>
                Education
              </Text>

              {resume.education.map(
                (edu: any, index: number) => (
                  <View
                    key={index}
                    style={styles.entryContainer}
                  >
                    {edu.college && (
                      <Text style={styles.entryTitle}>
                        {edu.college}
                      </Text>
                    )}

                    {edu.degree && (
                      <Text style={styles.entrySubtitle}>
                        {edu.degree}
                      </Text>
                    )}

                    {edu.branch && (
                      <Text style={styles.entrySubtitle}>
                        {edu.branch}
                      </Text>
                    )}

                    {edu.cgpa && (
                      <Text style={styles.entrySubtitle}>
                        CGPA: {edu.cgpa}
                      </Text>
                    )}

                    {(edu.startYear || edu.endYear) && (
                      <Text style={styles.entryDates}>
                        {edu.startYear || ""}
                        {edu.startYear && edu.endYear
                          ? " - "
                          : ""}
                        {edu.endYear || ""}
                      </Text>
                    )}
                  </View>
                )
              )}
            </View>
          )}

        {/* Experience */}
        {Array.isArray(resume.experience) &&
          resume.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>
                Experience
              </Text>

              {resume.experience.map(
                (exp: any, index: number) => (
                  <View
                    key={index}
                    style={styles.entryContainer}
                  >
                    {exp.company && (
                      <Text style={styles.entryTitle}>
                        {exp.company}
                      </Text>
                    )}

                    {exp.position && (
                      <Text style={styles.entrySubtitle}>
                        {exp.position}
                      </Text>
                    )}

                    {exp.duration && (
                      <Text style={styles.entryDates}>
                        {exp.duration}
                      </Text>
                    )}

                    {exp.description && (
                      <Text style={styles.bodyText}>
                        {exp.description}
                      </Text>
                    )}
                  </View>
                )
              )}
            </View>
          )}

        {/* Projects */}
        {Array.isArray(resume.projects) &&
          resume.projects.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>
                Projects
              </Text>

              {resume.projects.map(
                (project: any, index: number) => (
                  <View
                    key={index}
                    style={styles.entryContainer}
                  >
                    {project.title && (
                      <Text style={styles.entryTitle}>
                        {project.title}
                      </Text>
                    )}

                    {project.description && (
                      <Text style={styles.bodyText}>
                        {project.description}
                      </Text>
                    )}

                    {project.github && (
                      <Text style={styles.entryDates}>
                        {project.github}
                      </Text>
                    )}
                  </View>
                )
              )}
            </View>
          )}

        {/* Certifications */}
        {Array.isArray(resume.certification) &&
          resume.certification.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>
                Certifications
              </Text>

              {resume.certification.map(
                (cert: any, index: number) => (
                  <Text
                    key={index}
                    style={styles.bulletText}
                  >
                    • {cert}
                  </Text>
                )
              )}
            </View>
          )}
      </View>
    </Page>
  </Document>
);

export default ResumeDocument;