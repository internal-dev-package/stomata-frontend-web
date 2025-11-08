// src/components/LandsList.tsx
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

interface LandItem {
  tokenId: bigint;
  tokenURI: string;
  meta?: any;
}

function RowSkeleton() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.2}>
          <Skeleton variant="text" width={180} />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="rounded" width="100%" height={80} />
        </Stack>
      </CardContent>
    </Card>
  );
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
      // <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      //   {/* <CircularProgress size={18} /> <Typography>Loading lands…</Typography> */}
      //   <RowSkeleton />
      // </Box>
      <Grid container spacing={2}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Grid key={i} item xs={12} md={6} lg={4}>
            <RowSkeleton />
          </Grid>
        ))}
      </Grid>
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
        // const img = m?.ui?.image;
        const img =
          "https://www.green.earth/hubfs/What%20is%20sustainable%20land%20management%20-Pillar%20%20Combating%20Desertification_featured.png";
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
