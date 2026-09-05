import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { StageExhaust } from "@/features/story/components/acceleration/StageExhaust";
import { StageFact } from "@/features/story/components/acceleration/StageFact";
import { Palette } from "@/common/models/palette";
import { ignitedSelector, type RocketStageViewModel } from "@/features/story/helpers/accelerationContent";

interface RocketStageProps {
  stage: RocketStageViewModel;
}

/** One stage of the rocket: a card that lights up in COMET and starts burning when its turn comes. */
export const RocketStage = ({ stage }: RocketStageProps) => {
  const ignited = ignitedSelector(stage.stageNumber);
  return (
    <Box component="li" sx={{ listStyle: "none" }}>
      <Stack
        sx={{
          gap: "0.4rem",
          padding: "0.85rem 1.1rem 0.95rem",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          background: `linear-gradient(150deg, ${alpha(Palette.SKY_2, 0.72)} 0%, ${alpha(Palette.SKY, 0.72)} 100%)`,
          opacity: 0.34,
          transform: "translateY(10px)",
          transition:
            "opacity 0.6s ease, transform 0.7s cubic-bezier(.2,.8,.2,1), border-color 0.5s ease, box-shadow 0.6s ease",
          [ignited]: {
            opacity: 1,
            transform: "translateY(0)",
            borderColor: alpha(Palette.COMET, 0.55),
            boxShadow: `0 0 0 1px ${alpha(Palette.COMET, 0.18)}, 0 18px 46px ${alpha(Palette.SKY_DEEP, 0.6)}, 0 0 44px ${Palette.COMET_SOFT}`,
          },
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "baseline", justifyContent: "space-between" }}>
          <Typography variant="label" sx={{ color: "text.disabled", [ignited]: { color: "primary.main" } }}>
            {stage.stageLabel}
          </Typography>
          <Typography variant="label" sx={{ color: "text.disabled" }}>
            {stage.year}
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.25 }}>
          {stage.title}
        </Typography>
        <Box component="ul" sx={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.45rem" }}>
          {stage.facts.map((fact, index) => (
            <StageFact key={fact.id} fact={fact} stageNumber={stage.stageNumber} index={index} />
          ))}
        </Box>
      </Stack>
      <StageExhaust stageNumber={stage.stageNumber} />
    </Box>
  );
};
