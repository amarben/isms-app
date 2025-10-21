import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface NarrationSection {
  title: string
  content: string
  testSteps: number[]
  audioPath?: string
  duration?: number
}

class NarrationVideoSync {
  private apiKey: string
  private sections: NarrationSection[] = []
  private audioDir: string
  private outputDir: string

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required')
    }

    this.audioDir = path.join(__dirname, '../test-results/audio-segments')
    this.outputDir = path.join(__dirname, '../test-results')

    // Ensure directories exist
    if (!fs.existsSync(this.audioDir)) {
      fs.mkdirSync(this.audioDir, { recursive: true })
    }
  }

  /**
   * Parse the comprehensive narration markdown and map sections to test steps
   */
  parseNarration(markdownPath: string): void {
    const content = fs.readFileSync(markdownPath, 'utf-8')

    // Split by ## headers
    const sections = content.split(/^## /m).filter(s => s.trim())

    // Map each section to test steps based on content analysis
    const sectionMapping: NarrationSection[] = [
      {
        title: 'Introduction',
        content: this.extractSectionContent(sections, 'Introduction'),
        testSteps: [1] // Dashboard Access
      },
      {
        title: 'The Journey Begins',
        content: this.extractSectionContent(sections, 'The Journey Begins'),
        testSteps: [2, 3] // Navigation + Step 1 Overview
      },
      {
        title: 'Establishing Organizational Context',
        content: this.extractSectionContent(sections, 'Establishing Organizational Context'),
        testSteps: [4, 5, 6] // Org Name + Industry + Policy Details
      },
      {
        title: 'Identifying Internal Challenges',
        content: this.extractSectionContent(sections, 'Identifying Internal Challenges'),
        testSteps: [7] // Internal Issues Selection
      },
      {
        title: 'Understanding External Pressures',
        content: this.extractSectionContent(sections, 'Understanding External Pressures'),
        testSteps: [8] // External Issues Selection
      },
      {
        title: 'Identifying Stakeholders',
        content: this.extractSectionContent(sections, 'Identifying Stakeholders'),
        testSteps: [9, 10] // Progress to Step 2 + Interested Parties Selection
      },
      {
        title: 'Documenting Dependencies',
        content: this.extractSectionContent(sections, 'Documenting Dependencies'),
        testSteps: [11, 12] // Progress to Step 3 + Skipping Interfaces
      },
      {
        title: 'Defining Exclusions',
        content: this.extractSectionContent(sections, 'Defining Exclusions'),
        testSteps: [13, 14] // Progress to Step 4 + Selecting Exclusions
      },
      {
        title: 'Formalizing the Scope Statement',
        content: this.extractSectionContent(sections, 'Formalizing the Scope Statement'),
        testSteps: [15, 16, 17, 18] // Progress to Step 5 + Processes + Departments + Locations
      },
      {
        title: 'Adding Context and Completing the Process',
        content: this.extractSectionContent(sections, 'Adding Context and Completing the Process'),
        testSteps: [19, 20] // Review + Completion
      },
      {
        title: 'Conclusion',
        content: this.extractSectionContent(sections, 'Conclusion'),
        testSteps: [] // Play after completion
      }
    ]

    this.sections = sectionMapping.filter(s => s.content.length > 0)

    console.log(`\n📚 Parsed ${this.sections.length} narration sections\n`)
    this.sections.forEach(s => {
      console.log(`  • ${s.title} → Steps ${s.testSteps.join(', ') || 'outro'}`)
      console.log(`    Length: ${s.content.length} chars`)
    })
  }

  private extractSectionContent(sections: string[], title: string): string {
    const section = sections.find(s => s.trim().startsWith(title))
    if (!section) return ''

    // Extract content, remove the title line
    const lines = section.split('\n')
    lines.shift() // Remove title

    return lines.join('\n').trim()
  }

  /**
   * Generate audio for all sections using OpenAI TTS
   */
  async generateAllAudio(): Promise<void> {
    console.log('\n🎙️  Generating audio for all sections...\n')

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i]
      const audioPath = path.join(this.audioDir, `section-${i + 1}-${this.sanitizeFilename(section.title)}.mp3`)

      console.log(`  [${i + 1}/${this.sections.length}] ${section.title}`)

      // Check if audio already exists
      if (fs.existsSync(audioPath)) {
        console.log(`    ✓ Using existing audio`)
        section.audioPath = audioPath
        section.duration = this.getAudioDuration(audioPath)
        continue
      }

      await this.generateAudio(section.content, audioPath)
      section.audioPath = audioPath
      section.duration = this.getAudioDuration(audioPath)

      console.log(`    ✓ Generated (${section.duration?.toFixed(1)}s)`)
    }
  }

  /**
   * Generate audio using OpenAI TTS API
   */
  private async generateAudio(text: string, outputPath: string): Promise<void> {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        voice: 'alloy',
        input: text,
        speed: 1.0, // Normal speed for comprehensive narration
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${error}`)
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    fs.writeFileSync(outputPath, buffer)
  }

  /**
   * Get audio duration using ffprobe
   */
  private getAudioDuration(audioPath: string): number {
    try {
      const output = execSync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`,
        { encoding: 'utf-8' }
      )
      return parseFloat(output.trim())
    } catch (error) {
      console.error(`Error getting duration for ${audioPath}:`, error)
      return 0
    }
  }

  /**
   * Generate timing configuration for the test
   */
  generateTimingConfig(): void {
    console.log('\n⏱️  Timing Configuration for Test:\n')

    let totalDuration = 0
    const config: any = {}

    this.sections.forEach((section, index) => {
      if (!section.duration) return

      totalDuration += section.duration

      const avgPerStep = section.testSteps.length > 0
        ? section.duration / section.testSteps.length
        : section.duration

      config[section.title] = {
        steps: section.testSteps,
        totalDuration: section.duration,
        averagePerStep: avgPerStep,
        audioFile: section.audioPath
      }

      console.log(`  ${section.title}`)
      console.log(`    Duration: ${section.duration.toFixed(1)}s`)
      console.log(`    Steps: ${section.testSteps.join(', ') || 'outro'}`)
      console.log(`    Avg per step: ${avgPerStep.toFixed(1)}s`)
      console.log()
    })

    console.log(`\n📊 Total narration duration: ${totalDuration.toFixed(1)}s (${(totalDuration / 60).toFixed(1)} minutes)\n`)

    // Save config to file
    const configPath = path.join(this.outputDir, 'timing-config.json')
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    console.log(`💾 Timing config saved to: ${configPath}\n`)
  }

  /**
   * Merge all audio segments into a single track sequentially
   */
  async createMergedAudio(): Promise<string> {
    console.log('\n🔊 Creating merged audio track...\n')

    // Create concat file for ffmpeg
    const concatFilePath = path.join(this.audioDir, 'concat-list.txt')
    const concatLines: string[] = []

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i]
      if (!section.audioPath || !section.duration) continue

      // Add audio segment
      concatLines.push(`file '${section.audioPath}'`)
      console.log(`  + ${section.title} (${section.duration.toFixed(1)}s)`)
    }

    fs.writeFileSync(concatFilePath, concatLines.join('\n'))

    // Merge using ffmpeg concat
    const outputAudioPath = path.join(this.outputDir, 'narration-full.mp3')
    const command = `ffmpeg -f concat -safe 0 -i "${concatFilePath}" -c copy "${outputAudioPath}" -y`

    console.log('\n  Merging audio segments...')
    execSync(command, { stdio: 'inherit' })

    console.log(`\n  ✓ Merged audio saved to: ${outputAudioPath}\n`)

    return outputAudioPath
  }

  /**
   * Generate silence audio file
   */
  private generateSilence(duration: number, outputPath: string): void {
    const command = `ffmpeg -f lavfi -i anullsrc=r=44100:cl=stereo -t ${duration} -q:a 9 -acodec libmp3lame "${outputPath}" -y`
    execSync(command, { stdio: 'ignore' })
  }

  /**
   * Merge audio with video
   */
  async mergeAudioVideo(videoPath: string, audioPath: string): Promise<string> {
    console.log('\n🎬 Merging audio with video...\n')

    const outputPath = path.join(this.outputDir, 'scope-demo-with-full-narration.webm')

    // Use ffmpeg to merge, converting audio to opus for webm compatibility
    const command = `ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a libopus -shortest "${outputPath}" -y`

    console.log('  Processing...')
    execSync(command, { stdio: 'inherit' })

    console.log(`\n  ✓ Final video saved to: ${outputPath}\n`)

    return outputPath
  }

  private sanitizeFilename(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  }
}

// Main execution
async function main() {
  try {
    console.log('🎭 ISMS Scope Demo - Narration to Video Sync\n')
    console.log('=' .repeat(60))

    const sync = new NarrationVideoSync()

    // Step 1: Parse the comprehensive narration markdown
    const narrationPath = path.join(__dirname, '../e2e/scope-creation-demo-narration.md')
    sync.parseNarration(narrationPath)

    // Step 2: Generate audio for all sections
    await sync.generateAllAudio()

    // Step 3: Generate timing configuration
    sync.generateTimingConfig()

    console.log('\n✅ Audio generation complete!')
    console.log('\n📋 Next steps:')
    console.log('  1. Review timing-config.json')
    console.log('  2. Adjust test timing in generate-narrative.spec.ts to match audio durations')
    console.log('  3. Run the test to generate video: npm run test:e2e')
    console.log('  4. Run this script with --merge flag to combine audio and video')
    console.log('\nExample: npm run sync-narration -- --merge path/to/video.webm\n')

  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

// Handle merge mode
if (process.argv.includes('--merge')) {
  const videoIndex = process.argv.indexOf('--merge') + 1
  const videoPath = process.argv[videoIndex]

  if (!videoPath || !fs.existsSync(videoPath)) {
    console.error('❌ Please provide a valid video path after --merge flag')
    process.exit(1)
  }

  (async () => {
    try {
      console.log('🎬 Merge mode activated\n')
      console.log('=' .repeat(60))

      const sync = new NarrationVideoSync()

      // Parse narration
      const narrationPath = path.join(__dirname, '../e2e/scope-creation-demo-narration.md')
      sync.parseNarration(narrationPath)

      // Check if audio already exists, generate if not
      let needsGeneration = false
      for (const section of (sync as any).sections) {
        const expectedPath = path.join((sync as any).audioDir, `section-${(sync as any).sections.indexOf(section) + 1}-${(sync as any).sanitizeFilename(section.title)}.mp3`)
        if (!fs.existsSync(expectedPath)) {
          needsGeneration = true
          break
        }
      }

      if (needsGeneration) {
        console.log('\n⚠️  Audio segments not found, generating...\n')
        await sync.generateAllAudio()
      } else {
        console.log('\n✓ Using existing audio segments\n')
        // Load audio paths and durations
        await sync.generateAllAudio() // This will use existing files
      }

      // Create merged audio
      const mergedAudioPath = await sync.createMergedAudio()

      // Merge audio with video
      const finalVideoPath = await sync.mergeAudioVideo(videoPath, mergedAudioPath)

      console.log('\n✅ Video with comprehensive narration created successfully!')
      console.log(`\n📹 Final video: ${finalVideoPath}`)
      console.log(`\n🎬 Ready to view!`)

    } catch (error) {
      console.error('\n❌ Error:', error)
      process.exit(1)
    }
  })()

} else {
  main()
}
