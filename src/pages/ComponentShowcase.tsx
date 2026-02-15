import { useState } from "react";
import { RevealWaveImage } from "@/components/ui/reveal-wave-image";
import { SEO } from "@/components/shared/SEO";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, Eye, Settings2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const DEMO_IMAGES = [
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
];

const presets = {
  default: { revealRadius: 0.2, revealSoftness: 0.5, pixelSize: 3, waveSpeed: 0.5, waveFrequency: 3, waveAmplitude: 0.2, mouseRadius: 0.2 },
  dreamy: { revealRadius: 0.35, revealSoftness: 0.8, pixelSize: 2, waveSpeed: 0.3, waveFrequency: 2, waveAmplitude: 0.4, mouseRadius: 0.3 },
  glitch: { revealRadius: 0.15, revealSoftness: 0.2, pixelSize: 6, waveSpeed: 1.5, waveFrequency: 8, waveAmplitude: 0.5, mouseRadius: 0.15 },
  subtle: { revealRadius: 0.3, revealSoftness: 0.9, pixelSize: 2, waveSpeed: 0.2, waveFrequency: 1.5, waveAmplitude: 0.1, mouseRadius: 0.25 },
};

type PresetKey = keyof typeof presets;

export default function ComponentShowcase() {
  const [activeImage, setActiveImage] = useState(0);
  const [activePreset, setActivePreset] = useState<PresetKey>("default");
  const [config, setConfig] = useState(presets.default);

  const applyPreset = (key: PresetKey) => {
    setActivePreset(key);
    setConfig(presets[key]);
  };

  const updateConfig = (key: string, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
    setActivePreset("default");
  };

  const codeSnippet = `<RevealWaveImage
  src="${DEMO_IMAGES[activeImage].split("?")[0]}..."
  revealRadius={${config.revealRadius}}
  revealSoftness={${config.revealSoftness}}
  pixelSize={${config.pixelSize}}
  waveSpeed={${config.waveSpeed}}
  waveFrequency={${config.waveFrequency}}
  waveAmplitude={${config.waveAmplitude}}
  mouseRadius={${config.mouseRadius}}
/>`;

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Component Showcase" description="Interactive demo of the RevealWaveImage component" noIndex />

      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" />Back</Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">RevealWaveImage</h1>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Hero Demo */}
        <section className="space-y-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold tracking-tight">Interactive Shader Effect</h2>
            <p className="text-muted-foreground">Hover over the image to reveal colors through a dithered B&W filter with wave distortion.</p>
          </div>

          <div className="rounded-xl overflow-hidden border border-border bg-muted/30 aspect-[16/9] max-h-[520px]">
            <RevealWaveImage
              src={DEMO_IMAGES[activeImage]}
              revealRadius={config.revealRadius}
              revealSoftness={config.revealSoftness}
              pixelSize={config.pixelSize}
              waveSpeed={config.waveSpeed}
              waveFrequency={config.waveFrequency}
              waveAmplitude={config.waveAmplitude}
              mouseRadius={config.mouseRadius}
            />
          </div>

          {/* Image selector */}
          <div className="flex gap-2">
            {DEMO_IMAGES.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`rounded-lg overflow-hidden border-2 transition-all w-20 h-14 ${
                  activeImage === i ? "border-primary ring-2 ring-primary/20" : "border-border opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Demo ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* Controls */}
        <Tabs defaultValue="presets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="presets"><Eye className="mr-1.5 h-4 w-4" />Presets</TabsTrigger>
            <TabsTrigger value="controls"><Settings2 className="mr-1.5 h-4 w-4" />Controls</TabsTrigger>
            <TabsTrigger value="code"><Code className="mr-1.5 h-4 w-4" />Code</TabsTrigger>
          </TabsList>

          <TabsContent value="presets">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(Object.keys(presets) as PresetKey[]).map((key) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    activePreset === key ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => applyPreset(key)}
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm capitalize">{key}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <CardDescription className="text-xs">
                      {key === "default" && "Balanced dithering with medium waves"}
                      {key === "dreamy" && "Soft reveal, slow undulating waves"}
                      {key === "glitch" && "Harsh pixels, fast chaotic distortion"}
                      {key === "subtle" && "Minimal effect, gentle motion"}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="controls">
            <Card>
              <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                {[
                  { key: "revealRadius", label: "Reveal Radius", min: 0.05, max: 0.5, step: 0.01 },
                  { key: "revealSoftness", label: "Reveal Softness", min: 0.1, max: 1, step: 0.05 },
                  { key: "pixelSize", label: "Pixel Size", min: 1, max: 10, step: 1 },
                  { key: "waveSpeed", label: "Wave Speed", min: 0.1, max: 3, step: 0.1 },
                  { key: "waveFrequency", label: "Wave Frequency", min: 1, max: 15, step: 0.5 },
                  { key: "waveAmplitude", label: "Wave Amplitude", min: 0.05, max: 1, step: 0.05 },
                  { key: "mouseRadius", label: "Mouse Radius", min: 0.05, max: 0.5, step: 0.01 },
                ].map(({ key, label, min, max, step }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{label}</span>
                      <span className="text-muted-foreground font-mono">{(config as any)[key]}</span>
                    </div>
                    <Slider
                      value={[(config as any)[key]]}
                      min={min}
                      max={max}
                      step={step}
                      onValueChange={([v]) => updateConfig(key, v)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code">
            <Card>
              <CardContent className="p-0">
                <pre className="p-6 overflow-x-auto text-sm font-mono text-foreground/80 bg-muted/30 rounded-lg">
                  <code>{codeSnippet}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
