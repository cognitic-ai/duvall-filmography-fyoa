import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import Stack from "expo-router/stack";
import * as AC from "@bacons/apple-colors";
import {
  getMovieDetail,
  getMovieCreditsForMovie,
  backdropUrl,
  posterUrl,
  type MovieDetail,
} from "@/services/tmdb";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const movieId = Number(id);
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [duvallCharacter, setDuvallCharacter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!movieId) return;
    (async () => {
      try {
        const [detail, credits] = await Promise.all([
          getMovieDetail(movieId),
          getMovieCreditsForMovie(movieId),
        ]);
        setMovie(detail);
        const duvall = credits.cast.find(
          (c) => c.id === 3087
        );
        setDuvallCharacter(duvall?.character ?? null);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [movieId]);

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "" }} />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: AC.systemGroupedBackground as any,
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Stack.Screen options={{ title: "Error" }} />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            backgroundColor: AC.systemGroupedBackground as any,
          }}
        >
          <Text
            selectable
            style={{
              fontSize: 16,
              color: AC.systemRed as any,
              textAlign: "center",
            }}
          >
            {error || "Movie not found"}
          </Text>
        </View>
      </>
    );
  }

  const year = movie.release_date?.split("-")[0] ?? "";
  const hours = Math.floor(movie.runtime / 60);
  const mins = movie.runtime % 60;
  const runtime = movie.runtime > 0 ? `${hours}h ${mins}m` : null;

  return (
    <>
      <Stack.Screen
        options={{
          title: movie.title,
          headerLargeTitle: false,
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: AC.systemGroupedBackground as any }}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Backdrop */}
        {movie.backdrop_path ? (
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: backdropUrl(movie.backdrop_path, "w1280") }}
              style={{ width: "100%", aspectRatio: 16 / 9 }}
              contentFit="cover"
              transition={300}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                experimental_backgroundImage:
                  "linear-gradient(transparent, rgba(0,0,0,0.6))",
              }}
            />
          </View>
        ) : null}

        {/* Poster + Info row */}
        <View
          style={{
            flexDirection: "row",
            padding: 16,
            gap: 16,
            marginTop: movie.backdrop_path ? -40 : 0,
          }}
        >
          {movie.poster_path ? (
            <Image
              source={{ uri: posterUrl(movie.poster_path, "w342") }}
              style={{
                width: 120,
                height: 180,
                borderRadius: 12,
                borderCurve: "continuous",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              contentFit="cover"
              transition={200}
            />
          ) : null}
          <View style={{ flex: 1, justifyContent: "flex-end", gap: 6 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: movie.backdrop_path ? "white" : (AC.label as any),
              }}
            >
              {movie.title}
            </Text>
            {movie.tagline ? (
              <Text
                style={{
                  fontSize: 14,
                  fontStyle: "italic",
                  color: movie.backdrop_path
                    ? "rgba(255,255,255,0.8)"
                    : (AC.secondaryLabel as any),
                }}
              >
                {movie.tagline}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Metadata pills */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            paddingHorizontal: 16,
          }}
        >
          {year ? <Pill icon="sf:calendar" text={year} /> : null}
          {runtime ? <Pill icon="sf:clock" text={runtime} /> : null}
          {movie.vote_average > 0 ? (
            <Pill
              icon="sf:star.fill"
              text={movie.vote_average.toFixed(1)}
              iconColor={AC.systemYellow}
            />
          ) : null}
        </View>

        {/* Genres */}
        {movie.genres.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              padding: 16,
            }}
          >
            {movie.genres.map((g) => (
              <Text
                key={g.id}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  borderRadius: 16,
                  borderCurve: "continuous",
                  overflow: "hidden",
                  fontSize: 13,
                  fontWeight: "500",
                  color: AC.systemBlue as any,
                  backgroundColor: AC.tertiarySystemFill as any,
                }}
              >
                {g.name}
              </Text>
            ))}
          </View>
        ) : null}

        {/* Duvall's role */}
        {duvallCharacter ? (
          <View
            style={{
              marginHorizontal: 16,
              padding: 16,
              borderRadius: 12,
              borderCurve: "continuous",
              backgroundColor: AC.secondarySystemGroupedBackground as any,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Image
              source="sf:person.fill"
              style={{ fontSize: 20, color: AC.systemBlue as any }}
            />
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={{
                  fontSize: 13,
                  color: AC.tertiaryLabel as any,
                }}
              >
                Robert Duvall as
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "600",
                  color: AC.label as any,
                }}
              >
                {duvallCharacter}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Overview */}
        {movie.overview ? (
          <View style={{ padding: 16, gap: 8 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: AC.label as any,
              }}
            >
              Overview
            </Text>
            <Text
              selectable
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: AC.secondaryLabel as any,
              }}
            >
              {movie.overview}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

function Pill({
  icon,
  text,
  iconColor,
}: {
  icon: string;
  text: string;
  iconColor?: any;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        borderCurve: "continuous",
        backgroundColor: AC.tertiarySystemFill as any,
      }}
    >
      <Image
        source={icon}
        style={{ fontSize: 12, color: (iconColor ?? AC.secondaryLabel) as any }}
      />
      <Text
        style={{
          fontSize: 13,
          fontWeight: "500",
          color: AC.secondaryLabel as any,
          fontVariant: ["tabular-nums"],
        }}
      >
        {text}
      </Text>
    </View>
  );
}
