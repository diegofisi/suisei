import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { Palette } from "@/common/models/palette";
import {
  ACCELERATION_CREDIT,
  accelerationRenders,
  ignitedSelector,
} from "@/features/story/helpers/accelerationContent";

/** The two outfits of the acceleration; each one arrives with the stage that earned it. */
export const AccelerationRenders = () => (
  <Stack sx={{ gap: "0.9rem" }}>
    <Stack direction="row" spacing={2} sx={{ alignItems: "stretch" }}>
      {accelerationRenders.map((render) => (
        <Stack
          key={render.id}
          component="figure"
          sx={{
            flex: 1,
            minWidth: 0,
            margin: 0,
            gap: "0.5rem",
            opacity: 0,
            transform: "translateY(22px)",
            transition: "opacity 0.8s ease, transform 0.9s cubic-bezier(.2,.8,.2,1)",
            [ignitedSelector(render.stageNumber)]: {
              opacity: 1,
              transform: "translateY(0)",
            },
          }}
        >
          <Box
            sx={{
              aspectRatio: "3 / 4",
              minHeight: 0,
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              padding: "0.7rem",
              background: `radial-gradient(circle at 50% 58%, ${Palette.COMET_SOFT} 0%, transparent 70%), linear-gradient(160deg, ${alpha(
                Palette.SKY_2,
                0.9,
              )} 0%, ${alpha(Palette.SKY, 0.9)} 100%)`,
            }}
          >
            <Box
              component="img"
              src={render.image}
              alt={render.imageAlt}
              loading="lazy"
              sx={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </Box>
          <Typography component="figcaption" variant="label" sx={{ color: "primary.main", lineHeight: 1.4 }}>
            {render.tag}
          </Typography>
        </Stack>
      ))}
    </Stack>
    <Typography variant="caption" color="text.disabled" sx={{ maxWidth: "42ch" }}>
      {ACCELERATION_CREDIT}
    </Typography>
  </Stack>
);
