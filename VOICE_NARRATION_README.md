# AI Voice Narration for Test Videos

Automatically generate professional voice narration for your Playwright test videos using OpenAI's Text-to-Speech API.

## Features

- 🎤 **AI-Generated Narration**: Uses OpenAI TTS (Text-to-Speech) with high-quality voices
- 📝 **Automatic Script Generation**: Converts test narrative markdown to natural speech
- 🎬 **Video Merging**: Combines generated audio with Playwright test videos
- ⚡ **Easy to Use**: Single command to generate fully narrated videos

## Prerequisites

### 1. OpenAI API Key

Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### 2. FFmpeg

Install FFmpeg for video/audio merging:

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows:**
Download from [ffmpeg.org](https://ffmpeg.org/download.html)

### 3. Required Dependencies

Install Node.js dependencies:

```bash
npm install dotenv tsx
```

## Setup

### 1. Configure API Key

Add your OpenAI API key to `.env`:

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 2. Verify Installation

Check that FFmpeg is installed:

```bash
ffmpeg -version
```

## Usage

### Option 1: Full Automated Workflow

Run the test and generate narration in one command:

```bash
npm run demo:full-narrated
```

This will:
1. Run the Playwright test (with video recording)
2. Generate the narrative markdown
3. Create AI voice narration
4. Merge audio with video

### Option 2: Manual Steps

**Step 1: Run the test with video**
```bash
npm run demo:scope-narrative:video
```

**Step 2: Generate narration**
```bash
npm run add-narration
```

**Step 3: (Optional) Specify custom narrative**
```bash
npm run add-narration -- path/to/custom-narrative.md
```

## Output Files

After running, you'll find in `test-results/`:

- `scope-creation-narrative.md` - Test narrative text
- `narration.mp3` - Generated AI voice audio
- `video.webm` - Original Playwright video
- `video-with-narrated.mp4` - **Final video with narration** ✨

## Customization

### Voice Options

Edit `scripts/add-narration.ts` to change the voice:

```typescript
voice: 'alloy', // Change this
```

Available voices:
- `alloy` - Neutral and balanced
- `echo` - Clear and well-rounded
- `fable` - Warm and expressive
- `onyx` - Deep and authoritative
- `nova` - Energetic and confident
- `shimmer` - Bright and uplifting

### Speech Speed

Adjust narration speed (0.25 to 4.0):

```typescript
speed: 1.0, // 1.0 is normal, 1.5 is faster, 0.75 is slower
```

### TTS Model

Switch between quality levels:

```typescript
model: 'tts-1-hd', // High quality (more expensive)
// or
model: 'tts-1', // Standard quality (faster, cheaper)
```

## How It Works

1. **Parse Narrative**: Extracts steps from the generated markdown file
2. **Generate Script**: Converts markdown sections into natural speech text
3. **Call OpenAI TTS**: Sends script to OpenAI and receives MP3 audio
4. **Merge with Video**: Uses FFmpeg to combine audio and video

## Example Output

The generated narration will sound like:

> "Welcome to the ISMS Scope Definition workflow demonstration. Step 1: Dashboard Access. The user accesses the ISMS application and arrives at the main dashboard. This landing page provides an overview of the organization's ISO 27001 implementation journey..."

## Costs

OpenAI TTS pricing (as of 2025):
- **TTS-1-HD**: $15 per 1M characters (~$0.015 per 1,000 characters)
- **TTS-1**: $7.50 per 1M characters (~$0.0075 per 1,000 characters)

Typical narrative (~2,000 characters):
- **TTS-1-HD**: ~$0.03 per video
- **TTS-1**: ~$0.015 per video

## Troubleshooting

### "OpenAI API Key not set"
**Solution**: Make sure `.env` file exists with `OPENAI_API_KEY=your-key`

### "ffmpeg is not installed"
**Solution**: Install FFmpeg using the commands above

### "No video file found"
**Solution**: Run the Playwright test first with `npm run demo:scope-narrative:video`

### "Narrative file not found"
**Solution**: Make sure the narrative was generated during the test run

### Video/audio out of sync
**Solution**: The script uses `-shortest` flag to match durations. If issues persist:
1. Check video length matches narration length
2. Adjust narration speed in the script
3. Edit the narrative to be shorter/longer

## Advanced Usage

### Programmatic Usage

```typescript
import { VoiceNarrationGenerator } from './scripts/add-narration'

const generator = new VoiceNarrationGenerator(process.env.OPENAI_API_KEY!)

await generator.process(
  'test-results/my-narrative.md',
  'test-results/my-video.webm'
)
```

### Custom Script Generation

Override the `generateScript()` method to customize how narration is created from the narrative sections.

## Benefits

- 📚 **Better Documentation**: Videos with professional narration are more engaging
- 👥 **Training**: Perfect for onboarding new team members
- 🎓 **Tutorials**: Create professional-looking tutorial videos automatically
- 📊 **Presentations**: Impress stakeholders with narrated demos
- ♿ **Accessibility**: Makes videos accessible to users who can't read text

## Next Steps

Want to enhance further?

- Add background music
- Generate captions/subtitles
- Create multi-language narrations
- Add intro/outro slides
- Customize pacing per section

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review OpenAI TTS documentation
3. Check FFmpeg documentation
4. Review the script source code in `scripts/add-narration.ts`
