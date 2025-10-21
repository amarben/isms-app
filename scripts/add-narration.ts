/**
 * Add Voice Narration to Playwright Test Videos
 *
 * This script uses OpenAI's Text-to-Speech API to generate narration
 * from the test narrative and combines it with the recorded video.
 *
 * Requirements:
 * - OpenAI API key (set in .env as OPENAI_API_KEY)
 * - ffmpeg installed (for video/audio merging)
 * - Test video and narrative markdown files
 *
 * Usage:
 *   npm run add-narration
 */

import 'dotenv/config'
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

interface NarrativeSection {
  stepNumber: number
  action: string
  description: string
  details?: string
  timestamp: string
}

class VoiceNarrationGenerator {
  private apiKey: string
  private outputDir: string

  constructor(apiKey: string, outputDir: string = './test-results') {
    this.apiKey = apiKey
    this.outputDir = outputDir
  }

  /**
   * Parse narrative markdown file to extract sections
   */
  parseNarrative(markdownPath: string): NarrativeSection[] {
    const content = fs.readFileSync(markdownPath, 'utf-8')
    const sections: NarrativeSection[] = []

    // Match each step section
    const stepRegex = /## Step (\d+): (.+?)\n\n\*\*Time:\*\* (.+?) \| \*\*Action:\*\* .+?\n\n(.+?)(?:\n\n> (.+?))?\n\n---/gs

    let match
    while ((match = stepRegex.exec(content)) !== null) {
      sections.push({
        stepNumber: parseInt(match[1]),
        action: match[2].trim(),
        timestamp: match[3].trim(),
        description: match[4].trim(),
        details: match[5]?.trim()
      })
    }

    return sections
  }

  /**
   * Generate narration that fits within available time window
   */
  generateStepNarration(section: NarrativeSection, nextTimestamp?: number, currentTimestamp?: number): string {
    const stepNumber = section.stepNumber
    const availableTime = nextTimestamp && currentTimestamp ? nextTimestamp - currentTimestamp : 20

    // Adjust narration length based on available time window
    // Short window (< 5s) = very concise, Medium (5-10s) = moderate, Long (> 10s) = descriptive
    const narrations: { [key: number]: { short: string, medium: string, long: string } } = {
      1: { short: "", medium: "", long: "" },  // Skip - intro covers this
      2: {
        short: "Clicking Define I S M S Scope.",
        medium: "Now clicking Define I S M S Scope to begin.",
        long: "We're now clicking on Define I S M S Scope in the navigation menu."
      },
      3: {
        short: "The wizard opens on step one.",
        medium: "The five-step wizard opens with Internal and External Issues.",
        long: "The wizard opens, starting with step one: Internal and External Issues."
      },
      4: {
        short: "Entering the organization name.",
        medium: "Entering TechCorp Solutions Limited.",
        long: "Now entering the organization name: TechCorp Solutions Limited."
      },
      5: {
        short: "Setting the industry.",
        medium: "Specifying Cloud Services and Software Development.",
        long: "Specifying the industry as Cloud Services and Software Development."
      },
      6: {
        short: "Entering policy details.",
        medium: "Entering version 2.0, C E O Michael Anderson, C I S O Jennifer Martinez.",
        long: "Entering the policy details: version 2.0, C E O Michael Anderson, C I S O Jennifer Martinez, with dates for 2025 and annual review in 2026."
      },
      7: {
        short: "Selecting internal issues.",
        medium: "Selecting internal issues: R and D data, customer data, and financial data.",
        long: "Selecting internal issues: R and D data protection, customer data privacy, and financial data processing."
      },
      8: {
        short: "Selecting external issues.",
        medium: "Selecting regulations and cybersecurity threats.",
        long: "Selecting external issues: industry regulations like G D P R, and cybersecurity threats."
      },
      9: {
        short: "Moving to interested parties.",
        medium: "Proceeding to step two: Interested Parties.",
        long: "With step one complete, we proceed to step two: Interested Parties."
      },
      10: {
        short: "Identifying stakeholders.",
        medium: "Selecting Customers, Employees, and Regulatory Bodies.",
        long: "Identifying key stakeholders: Customers, Employees, and Regulatory Bodies like the G D P R authority."
      },
      11: {
        short: "Step three: Interfaces.",
        medium: "Moving to Interfaces and Dependencies.",
        long: "Moving to step three: Interfaces and Dependencies for system documentation."
      },
      12: {
        short: "Skipping custom interfaces.",
        medium: "Skipping custom interfaces for this demo.",
        long: "For this demonstration, we'll skip adding custom interfaces."
      },
      13: {
        short: "Step four: Exclusions.",
        medium: "Now at step four: Exclusions from scope.",
        long: "Now at step four: documenting exclusions from the I S M S scope."
      },
      14: {
        short: "Selecting exclusions.",
        medium: "Selecting B Y O D devices and guest WiFi.",
        long: "Selecting two exclusions: personal B Y O D devices and guest WiFi networks."
      },
      15: {
        short: "Final step: Scope Document.",
        medium: "Reaching the final step: Scope Document.",
        long: "Finally reaching step five, the Scope Document, to formalize our analysis."
      },
      16: {
        short: "Selecting processes.",
        medium: "Selecting software development, data processing, and infrastructure.",
        long: "Selecting key processes: software development, customer data processing, and network infrastructure."
      },
      17: {
        short: "Adding departments.",
        medium: "Including I T, R and D, and Customer Service.",
        long: "Including three departments: I T, Research and Development, and Customer Service."
      },
      18: {
        short: "Defining locations.",
        medium: "Selecting main office and data center.",
        long: "Selecting physical locations: the main office building and data center facility."
      },
      19: {
        short: "Reviewing the summary.",
        medium: "The summary shows 3 processes, 3 departments, 2 locations.",
        long: "The scope summary displays our complete definition: 3 processes, 3 departments, 2 locations, and 2 exclusions."
      },
      20: {
        short: "Scope complete!",
        medium: "Scope definition complete. Ready for certification.",
        long: "Scope definition complete! TechCorp Solutions is ready for I S O 27001 certification. Thank you for watching."
      }
    }

    const narrationSet = narrations[stepNumber]
    if (!narrationSet) return ""

    // Choose narration based on available time (be conservative to prevent overlaps)
    if (availableTime < 2) {
      return "" // Skip if too short
    } else if (availableTime < 5) {
      return narrationSet.short
    } else if (availableTime < 15) {
      return narrationSet.medium
    } else {
      return narrationSet.long
    }
  }

  /**
   * Generate audio using OpenAI Text-to-Speech API
   */
  async generateAudio(text: string, outputPath: string, stepNum?: number): Promise<void> {
    const label = stepNum ? `step ${stepNum}` : 'audio'
    console.log(`🎤 Generating ${label} narration...`)

    try {
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1-hd', // High quality model
          voice: 'alloy', // Options: alloy, echo, fable, onyx, nova, shimmer
          input: text,
          speed: 1.1, // Slightly faster for better pacing
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`OpenAI API error: ${JSON.stringify(error)}`)
      }

      const audioBuffer = await response.arrayBuffer()
      fs.writeFileSync(outputPath, Buffer.from(audioBuffer))

      console.log(`   ✅ Saved: ${path.basename(outputPath)}`)
    } catch (error) {
      console.error(`❌ Error generating ${label}:`, error)
      throw error
    }
  }

  /**
   * Create silence audio file of specified duration
   */
  async createSilence(duration: number, outputPath: string): Promise<void> {
    const command = `ffmpeg -f lavfi -i anullsrc=r=24000:cl=mono -t ${duration} -c:a libopus "${outputPath}" -y`
    await execAsync(command)
  }

  /**
   * Get audio duration using ffprobe
   */
  async getAudioDuration(audioPath: string): Promise<number> {
    const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`
    const { stdout } = await execAsync(command)
    return parseFloat(stdout.trim())
  }

  /**
   * Merge video and audio using ffmpeg
   */
  async mergeVideoAudio(videoPath: string, audioPath: string, outputPath: string): Promise<void> {
    console.log('🎬 Merging video and audio with ffmpeg...')

    try {
      // Check if ffmpeg is installed
      try {
        await execAsync('ffmpeg -version')
      } catch {
        throw new Error('ffmpeg is not installed. Install it with: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)')
      }

      // Merge video and audio
      // -shortest ensures output duration matches the shorter of video/audio
      // Use libopus for audio in WebM container (VP8 video + Opus audio)
      const command = `ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a libopus -shortest "${outputPath}" -y`

      await execAsync(command)

      console.log(`✅ Video with narration saved to: ${outputPath}`)
    } catch (error) {
      console.error('❌ Error merging video and audio:', error)
      throw error
    }
  }

  /**
   * Find the most recent video file in test results
   */
  findLatestVideo(): string | null {
    const testResultsDir = path.join(process.cwd(), this.outputDir)

    if (!fs.existsSync(testResultsDir)) {
      return null
    }

    let latestVideo: { path: string; time: number } | null = null

    const findVideos = (dir: string) => {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          findVideos(fullPath)
        } else if (item === 'video.webm') {
          if (!latestVideo || stat.mtime.getTime() > latestVideo.time) {
            latestVideo = { path: fullPath, time: stat.mtime.getTime() }
          }
        }
      }
    }

    findVideos(testResultsDir)
    return latestVideo?.path || null
  }

  /**
   * Main process: Generate synchronized narrated video
   */
  async process(narrativePath: string, videoPath?: string): Promise<void> {
    console.log('\n🎬 ========================================')
    console.log('   SYNCHRONIZED AI NARRATION GENERATOR')
    console.log('========================================\n')

    // Find video if not specified
    if (!videoPath) {
      videoPath = this.findLatestVideo()
      if (!videoPath) {
        throw new Error('No video file found. Run the Playwright test first.')
      }
      console.log(`📹 Found video: ${videoPath}`)
    }

    // Verify files exist
    if (!fs.existsSync(narrativePath)) {
      throw new Error(`Narrative file not found: ${narrativePath}`)
    }
    if (!fs.existsSync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`)
    }

    // Parse narrative
    console.log(`📖 Reading narrative from: ${narrativePath}`)
    const sections = this.parseNarrative(narrativePath)
    console.log(`✅ Found ${sections.length} narrative sections\n`)

    // Create temp directory for audio segments
    const tempDir = path.join(this.outputDir, 'temp-audio')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }

    console.log('🎙️  Generating synchronized audio segments...\n')

    // Generate intro - now we have time for a proper introduction
    const introText = 'Welcome to this demonstration of I S M S scope definition. In this video, we\'ll walk through the complete five-step workflow for defining an Information Security Management System scope according to I S O 27001. We\'ll be setting up the scope for TechCorp Solutions, a cloud services and software development company. Let\'s begin by accessing the application.'
    const introPath = path.join(tempDir, '00-intro.mp3')
    await this.generateAudio(introText, introPath, 0)
    const introDuration = await this.getAudioDuration(introPath)

    console.log(`   ✅ Intro: ${introDuration.toFixed(1)}s\n`)

    // Generate audio for each step with timing
    const audioSegments: Array<{timestamp: number, audioPath: string, duration: number}> = []

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const stepNum = section.stepNumber
      const timestamp = parseFloat(section.timestamp.replace('s', ''))
      const nextTimestamp = i < sections.length - 1 ? parseFloat(sections[i + 1].timestamp.replace('s', '')) : undefined

      const narration = this.generateStepNarration(section, nextTimestamp, timestamp)

      // Skip empty narrations
      if (!narration || narration.trim().length === 0) {
        console.log(`   ⏭️  Step ${stepNum}: Skipped (no narration)`)
        continue
      }

      const audioPath = path.join(tempDir, `${String(stepNum).padStart(2, '0')}-step.mp3`)

      await this.generateAudio(narration, audioPath, stepNum)
      const duration = await this.getAudioDuration(audioPath)

      audioSegments.push({ timestamp, audioPath, duration })

      // Small delay to avoid API rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log('\n📐 Building timeline with precise synchronization...\n')

    // Build concat file for ffmpeg with proper timing
    const concatFilePath = path.join(tempDir, 'concat.txt')
    const timeline: string[] = []

    // Add intro at start
    timeline.push(`file '${path.basename(introPath)}'`)

    let currentTime = introDuration

    for (let i = 0; i < audioSegments.length; i++) {
      const segment = audioSegments[i]
      const nextTimestamp = i < audioSegments.length - 1 ? audioSegments[i + 1].timestamp : 999
      const availableWindow = nextTimestamp - segment.timestamp

      // CRITICAL: Skip narrations that won't fit in the time window
      if (segment.duration > availableWindow - 0.2) { // Leave 0.2s buffer
        console.log(`   ⏭️  ${segment.timestamp.toFixed(1)}s: Skipping (${segment.duration.toFixed(1)}s audio won't fit in ${availableWindow.toFixed(1)}s window)`)
        continue
      }

      const silenceDuration = Math.max(0, segment.timestamp - currentTime)

      if (silenceDuration > 0.1) {
        // Add silence before this segment
        const silencePath = path.join(tempDir, `silence-${i}.opus`)
        await this.createSilence(silenceDuration, silencePath)
        timeline.push(`file '${path.basename(silencePath)}'`)
        currentTime += silenceDuration
      }

      // Add the audio segment
      timeline.push(`file '${path.basename(segment.audioPath)}'`)
      currentTime += segment.duration

      console.log(`   ⏱️  ${segment.timestamp.toFixed(1)}s: Step ${i + 1} (${segment.duration.toFixed(1)}s audio, ${availableWindow.toFixed(1)}s window)`)
    }

    fs.writeFileSync(concatFilePath, timeline.join('\n'))

    console.log('\n🔗 Concatenating audio segments...')

    // Concatenate all audio segments (MP3 files) to MP3 first
    const tempAudioPath = path.join(this.outputDir, 'synced-narration.mp3')
    const concatCommand = `ffmpeg -f concat -safe 0 -i "${concatFilePath}" -c copy "${tempAudioPath}" -y`
    await execAsync(concatCommand)

    // Convert MP3 to Opus for WebM compatibility
    console.log('🔄 Converting to Opus for WebM...')
    const finalAudioPath = path.join(this.outputDir, 'synced-narration.opus')
    const convertCommand = `ffmpeg -i "${tempAudioPath}" -c:a libopus -b:a 128k "${finalAudioPath}" -y`
    await execAsync(convertCommand)

    // Remove temp MP3
    fs.unlinkSync(tempAudioPath)

    console.log(`✅ Synchronized audio created: ${finalAudioPath}\n`)

    // Merge video and audio
    const outputPath = path.join(
      path.dirname(videoPath),
      'video-with-synced-narration.webm'
    )
    await this.mergeVideoAudio(videoPath, finalAudioPath, outputPath)

    // Cleanup temp files
    console.log('🧹 Cleaning up temporary files...')
    fs.rmSync(tempDir, { recursive: true, force: true })

    console.log('\n🎉 ========================================')
    console.log('   SYNCHRONIZED NARRATION COMPLETE!')
    console.log('========================================\n')
    console.log(`📹 Original video: ${videoPath}`)
    console.log(`🎤 Synced audio: ${finalAudioPath}`)
    console.log(`✨ Final output: ${outputPath}\n`)
  }
}

// Main execution
async function main() {
  // Check for OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.error('❌ Error: OPENAI_API_KEY environment variable not set')
    console.error('\nTo fix:')
    console.error('1. Get an API key from: https://platform.openai.com/api-keys')
    console.error('2. Create a .env file in the project root')
    console.error('3. Add: OPENAI_API_KEY=your-api-key-here')
    console.error('4. Install dotenv: npm install dotenv')
    console.error('5. Run: node -r dotenv/config scripts/add-narration.js\n')
    process.exit(1)
  }

  const generator = new VoiceNarrationGenerator(apiKey)

  // Get narrative path from command line or use default
  const narrativePath = process.argv[2] || path.join(
    process.cwd(),
    'test-results',
    'scope-creation-narrative.md'
  )

  try {
    await generator.process(narrativePath)
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

export { VoiceNarrationGenerator }

// Run main function when executed directly
main()
