import type { AnalysisResult, Language } from './types'

export async function generatePDF(results: AnalysisResult, lang: Language): Promise<void> {
  const { jsPDF } = await import('jspdf')
  const html2canvas = (await import('html2canvas')).default

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const pageWidth = 210
  const margin = 16
  const contentWidth = pageWidth - margin * 2
  let y = margin

  const purple = [30, 26, 46] as [number, number, number]
  const rose = [232, 99, 122] as [number, number, number]
  const muted = [122, 113, 144] as [number, number, number]
  const sage = [91, 160, 138] as [number, number, number]

  pdf.setFillColor(...purple)
  pdf.rect(0, 0, 210, 40, 'F')

  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(22)
  pdf.setTextColor(255, 255, 255)
  pdf.text('WerkWijzer', margin, y + 12)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(200, 190, 220)
  const subtitle = lang === 'nl' ? 'Jouw persoonlijke carrière-analyse' : 'Your personal career analysis'
  pdf.text(subtitle, margin, y + 20)

  const date = new Date().toLocaleDateString(lang === 'nl' ? 'nl-NL' : 'en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  pdf.setFontSize(9)
  pdf.text(date, pageWidth - margin, y + 12, { align: 'right' })

  y = 50

  pdf.setFillColor(253, 251, 255)
  pdf.roundedRect(margin, y, contentWidth, 40, 3, 3, 'F')
  pdf.setDrawColor(226, 220, 240)
  pdf.setLineWidth(0.3)
  pdf.roundedRect(margin, y, contentWidth, 40, 3, 3, 'S')

  const profileTitle = lang === 'nl' ? 'Jouw werkprofiel' : 'Your work profile'
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(11)
  pdf.setTextColor(...purple)
  pdf.text(profileTitle, margin + 6, y + 8)

  const profileText = lang === 'nl' ? results.overall_profile_nl : results.overall_profile_en
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  pdf.setTextColor(...muted)
  const profileLines = pdf.splitTextToSize(profileText, contentWidth - 12)
  pdf.text(profileLines.slice(0, 3), margin + 6, y + 15)

  const tags = lang === 'nl' ? results.profile_tags_nl : results.profile_tags_en
  let tagX = margin + 6
  y += 32
  tags.forEach((tag) => {
    pdf.setFillColor(232, 99, 122)
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(7)
    const tagW = pdf.getTextWidth(tag) + 6
    if (tagX + tagW > pageWidth - margin) return
    pdf.roundedRect(tagX, y, tagW, 5, 1.5, 1.5, 'F')
    pdf.text(tag, tagX + 3, y + 3.5)
    tagX += tagW + 3
  })

  y += 12

  const matchTitle = lang === 'nl' ? 'Jouw 7 matches' : 'Your 7 matches'
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(13)
  pdf.setTextColor(...purple)
  pdf.text(matchTitle, margin, y)
  y += 8

  results.matches.forEach((match, i) => {
    if (y > 250) {
      pdf.addPage()
      y = margin
    }

    const cardH = 46
    pdf.setFillColor(253, 251, 255)
    pdf.roundedRect(margin, y, contentWidth, cardH, 3, 3, 'F')
    pdf.setDrawColor(226, 220, 240)
    pdf.setLineWidth(0.3)
    pdf.roundedRect(margin, y, contentWidth, cardH, 3, 3, 'S')

    pdf.setFillColor(...rose)
    pdf.roundedRect(pageWidth - margin - 18, y + 4, 16, 7, 2, 2, 'F')
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(7)
    pdf.setTextColor(255, 255, 255)
    pdf.text(`${match.match_score}%`, pageWidth - margin - 10, y + 8.5, { align: 'center' })

    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(11)
    pdf.setTextColor(...purple)
    const title = lang === 'nl' ? match.title_nl : match.title_en
    pdf.text(`${i + 1}. ${title}`, margin + 5, y + 9)

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(8)
    pdf.setTextColor(...sage)
    pdf.text(match.salary_indication, margin + 5, y + 15)

    const summary = lang === 'nl' ? match.summary_nl : match.summary_en
    pdf.setTextColor(...muted)
    pdf.setFontSize(8.5)
    const summaryLines = pdf.splitTextToSize(summary, contentWidth - 24)
    pdf.text(summaryLines.slice(0, 2), margin + 5, y + 22)

    const matchTags = lang === 'nl' ? match.tags_nl : match.tags_en
    let tx = margin + 5
    const ty = y + 36
    matchTags.slice(0, 4).forEach((tag) => {
      pdf.setFillColor(237, 247, 244)
      pdf.setTextColor(...sage)
      pdf.setFontSize(7)
      const tw = pdf.getTextWidth(tag) + 5
      if (tx + tw > pageWidth - margin - 20) return
      pdf.roundedRect(tx, ty, tw, 5, 1.5, 1.5, 'F')
      pdf.text(tag, tx + 2.5, ty + 3.5)
      tx += tw + 3
    })

    y += cardH + 5
  })

  if (y > 260) {
    pdf.addPage()
    y = margin
  } else {
    y += 10
  }

  pdf.setFont('helvetica', 'italic')
  pdf.setFontSize(8)
  pdf.setTextColor(...muted)
  const footer = lang === 'nl'
    ? `Gegenereerd via WerkWijzer op ${date}`
    : `Generated via WerkWijzer on ${date}`
  pdf.text(footer, pageWidth / 2, y, { align: 'center' })

  pdf.save('werkwijzer-matches.pdf')
}
