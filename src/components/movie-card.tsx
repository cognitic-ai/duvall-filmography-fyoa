import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import * as AC from "@bacons/apple-colors";
import { posterUrl } from "@/services/tmdb";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  year: string;
  character?: string;
  rating: number;
}

export default function MovieCard({
  id,
  title,
  posterPath,
  year,
  character,
  rating,
}: MovieCardProps) {
  return (
    <Link href={`/movie/${id}`} asChild>
      <Link.Trigger>
        <Pressable
          style={({ pressed }) => ({
            flexDirection: "row",
            gap: 12,
            padding: 12,
            borderRadius: 12,
            borderCurve: "continuous",
            backgroundColor: pressed
              ? (AC.systemGray5 as any)
              : (AC.secondarySystemGroupedBackground as any),
            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          })}
        >
          {posterPath ? (
            <Image
              source={{ uri: posterUrl(posterPath, "w185") }}
              style={{
                width: 70,
                height: 105,
                borderRadius: 8,
                borderCurve: "continuous",
              }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={{
                width: 70,
                height: 105,
                borderRadius: 8,
                borderCurve: "continuous",
                backgroundColor: AC.systemGray4 as any,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source="sf:film"
                style={{ fontSize: 24, color: AC.systemGray as any }}
              />
            </View>
          )}
          <View style={{ flex: 1, gap: 4, justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: AC.label as any,
              }}
              numberOfLines={2}
            >
              {title}
            </Text>
            {character ? (
              <Text
                style={{
                  fontSize: 14,
                  color: AC.secondaryLabel as any,
                }}
                numberOfLines={1}
              >
                as {character}
              </Text>
            ) : null}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              {year ? (
                <Text
                  style={{
                    fontSize: 13,
                    color: AC.tertiaryLabel as any,
                  }}
                >
                  {year}
                </Text>
              ) : null}
              {rating > 0 ? (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
                >
                  <Image
                    source="sf:star.fill"
                    style={{ fontSize: 11, color: AC.systemYellow as any }}
                  />
                  <Text
                    style={{
                      fontSize: 13,
                      color: AC.tertiaryLabel as any,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {rating.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Image
              source="sf:chevron.right"
              style={{
                fontSize: 14,
                color: AC.tertiaryLabel as any,
                fontWeight: "600",
              }}
            />
          </View>
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
    </Link>
  );
}
