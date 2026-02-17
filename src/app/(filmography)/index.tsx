import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useNavigation } from "expo-router";
import * as AC from "@bacons/apple-colors";
import MovieCard from "@/components/movie-card";
import { getMovieCredits, type Movie } from "@/services/tmdb";

type SortMode = "year" | "rating" | "title";

export default function FilmographyIndex() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("year");
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Search movies...",
        onChangeText: (e: any) => setSearch(e.nativeEvent.text),
        onCancelButtonPress: () => setSearch(""),
      },
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      try {
        const credits = await getMovieCredits();
        // Deduplicate by movie id, keeping cast entries
        const seen = new Set<number>();
        const unique: Movie[] = [];
        for (const movie of credits.cast) {
          if (!seen.has(movie.id)) {
            seen.add(movie.id);
            unique.push(movie);
          }
        }
        setMovies(unique);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sortedAndFiltered = useMemo(() => {
    let filtered = movies;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = movies.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.character && m.character.toLowerCase().includes(q))
      );
    }

    return [...filtered].sort((a, b) => {
      switch (sortMode) {
        case "year":
          return (b.release_date || "").localeCompare(a.release_date || "");
        case "rating":
          return b.vote_average - a.vote_average;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [movies, search, sortMode]);

  const getYear = useCallback(
    (date: string) => (date ? date.split("-")[0] : ""),
    []
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: AC.systemGroupedBackground as any,
        }}
      >
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 12, color: AC.secondaryLabel as any }}>
          Loading filmography...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
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
          style={{ fontSize: 16, color: AC.systemRed as any, textAlign: "center" }}
        >
          {error}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sortedAndFiltered}
      contentInsetAdjustmentBehavior="automatic"
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 16, gap: 10 }}
      style={{ backgroundColor: AC.systemGroupedBackground as any }}
      ListHeaderComponent={
        <View style={{ gap: 8, marginBottom: 4 }}>
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {(["year", "rating", "title"] as SortMode[]).map((mode) => (
              <SortChip
                key={mode}
                label={mode === "year" ? "Year" : mode === "rating" ? "Rating" : "Title"}
                active={sortMode === mode}
                onPress={() => setSortMode(mode)}
              />
            ))}
          </View>
          <Text
            style={{
              fontSize: 13,
              color: AC.tertiaryLabel as any,
              fontVariant: ["tabular-nums"],
            }}
          >
            {sortedAndFiltered.length} film{sortedAndFiltered.length !== 1 ? "s" : ""}
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <MovieCard
          id={item.id}
          title={item.title}
          posterPath={item.poster_path}
          year={getYear(item.release_date)}
          character={item.character}
          rating={item.vote_average}
        />
      )}
    />
  );
}

function SortChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Text
      onPress={onPress}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        borderCurve: "continuous",
        overflow: "hidden",
        fontSize: 14,
        fontWeight: "600",
        color: active ? "white" : (AC.label as any),
        backgroundColor: active
          ? (AC.systemBlue as any)
          : (AC.tertiarySystemFill as any),
      }}
    >
      {label}
    </Text>
  );
}
