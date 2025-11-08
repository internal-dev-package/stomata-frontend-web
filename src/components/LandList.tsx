// src/components/LandsList.tsx
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

interface LandItem {
  tokenId: bigint;
  tokenURI: string;
  meta?: any;
}
export default function LandsList({
  items,
  loading,
}: {
  items: LandItem[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={18} /> <Typography>Loading lands…</Typography>
      </Box>
    );
  }
  if (!items?.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No lands yet.
      </Typography>
    );
  }
  return (
    <Grid container spacing={2}>
      {items.map((it) => {
        const m = it.meta;
        const title = m?.land?.name || `Token #${it.tokenId}`;
        const img = m?.ui?.image;
        const tags: string[] = m?.ui?.tags || [];
        return (
          <Grid item xs={12} md={6} lg={4} key={String(it.tokenId)}>
            <Card sx={{ borderRadius: 3 }}>
              {img ? (
                <CardMedia
                  component="img"
                  height="160"
                  image={img}
                  alt={title}
                />
              ) : null}
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Token ID: {it.tokenId.toString()}
                </Typography>
                {m?.land?.areaHa ? (
                  <Typography variant="body2">
                    Area: {m.land.areaHa} ha
                  </Typography>
                ) : null}
                {tags?.length ? (
                  <Box
                    sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}
                  >
                    {tags.map((t) => (
                      <Chip key={t} size="small" label={t} />
                    ))}
                  </Box>
                ) : null}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
