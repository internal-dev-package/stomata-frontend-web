// /src/components/FarmersList.tsx
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  Stack,
  Skeleton,
  Button,
  Divider,
  Avatar,
} from "@mui/material";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import { useFarmers } from "../hooks/useFarmer";
import { CopyButton } from "./CopyButton";

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

export default function FarmersList({
  ownerAddress,
}: {
  ownerAddress?: string;
}) {
  const { data, loading, error, refetch } = useFarmers(ownerAddress);

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={1.5}
      >
        <Typography variant="h6">
          Farmer Tokens{" "}
          {ownerAddress
            ? `(owner: ${ownerAddress.slice(0, 6)}...${ownerAddress.slice(-4)})`
            : ""}
        </Typography>
        {/* <Button variant="outlined" size="small" onClick={() => refetch()}>
          Refresh
        </Button> */}
      </Box>

      {loading && (
        <Grid container spacing={2}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Grid key={i} item xs={12} md={6} lg={4}>
              <RowSkeleton />
            </Grid>
          ))}
        </Grid>
      )}

      {error && (
        <Card variant="outlined" sx={{ borderColor: "error.main", mb: 2 }}>
          <CardContent>
            <Typography color="error">Error: {error.message}</Typography>
          </CardContent>
        </Card>
      )}

      {!loading && !error && data.length === 0 && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Belum ada farmer token.
            </Typography>
          </CardContent>
        </Card>
      )}

      {!loading && !error && data.length > 0 && (
        <Grid container spacing={2}>
          {data.map((f) => (
            <Grid key={String(f.tokenId)} item xs={12} md={6} lg={4}>
              <Card variant="outlined">
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "success.dark" }}>
                      <AgricultureIcon />
                    </Avatar>
                  }
                  title={`Token #${String(f.tokenId)}`}
                  subheader={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography
                        variant="caption"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {f.owner.slice(0, 6)}...{f.owner.slice(-4)}
                      </Typography>
                      <CopyButton text={f.owner} />
                    </Box>
                  }
                />
                <CardContent>
                  <Box mb={1}>
                    <Typography variant="caption" color="text.secondary">
                      TokenURI:
                    </Typography>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: "break-all" }}
                      >
                        <a href={f.tokenURI} target="_blank" rel="noreferrer">
                          {f.tokenURI}
                        </a>
                      </Typography>
                      <CopyButton text={f.tokenURI} />
                    </Box>
                  </Box>

                  {f.metadata ? (
                    <>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Metadata
                      </Typography>

                      {f.metadata?.name && (
                        <Typography variant="body2" gutterBottom>
                          <b>Name:</b> {f.metadata.name}
                        </Typography>
                      )}
                      {f.metadata?.description && (
                        <Typography variant="body2" gutterBottom>
                          <b>Description:</b> {f.metadata.description}
                        </Typography>
                      )}

                      {/* Company / Farmer ringkas */}
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                      >
                        {f.metadata?.company?.name && (
                          <Chip
                            label={`Company: ${f.metadata.company.name}`}
                            size="small"
                          />
                        )}
                        {f.metadata?.farmer?.name && (
                          <Chip
                            label={`Farmer: ${f.metadata.farmer.name}`}
                            size="small"
                          />
                        )}
                        {Array.isArray(f.metadata?.attributes) &&
                          f.metadata.attributes
                            .slice(0, 4)
                            .map((a: any, idx: number) => (
                              <Chip
                                key={idx}
                                size="small"
                                label={`${a.trait_type ?? "attr"}: ${String(
                                  a.value
                                )}`}
                                variant="outlined"
                              />
                            ))}
                      </Stack>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      (Metadata tidak tersedia / tidak dapat di-fetch)
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
