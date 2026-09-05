import { CometCanvas } from "@/features/story/components/hero/CometCanvas";
import { HeroShell } from "@/features/story/components/hero/HeroShell";
import { HeroTitles } from "@/features/story/components/hero/HeroTitles";
import { ScrollCue } from "@/features/story/components/hero/ScrollCue";
import { SignatureCanvas } from "@/features/story/components/hero/SignatureCanvas";
import { SignatureCaption } from "@/features/story/components/hero/SignatureCaption";
import { heroContent } from "@/features/story/helpers/heroContent";
import { useHeroScene } from "@/features/story/hooks/useHeroScene";

export const HeroContainer = () => {
  const scene = useHeroScene();
  return (
    <HeroShell
      sectionRef={scene.sectionRef}
      canvas={
        <>
          <CometCanvas canvasRef={scene.cometRef} />
          <SignatureCanvas canvasRef={scene.canvasRef} />
        </>
      }
      titles={
        <HeroTitles
          japaneseName={heroContent.japaneseName}
          eyebrow={heroContent.eyebrow}
          title={heroContent.title}
          meta={heroContent.meta}
        />
      }
      cue={<ScrollCue label={heroContent.scrollCue} />}
      caption={<SignatureCaption label={heroContent.signatureLabel} note={heroContent.signatureNote} />}
    />
  );
};
