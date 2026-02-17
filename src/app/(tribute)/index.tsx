import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as AC from "@bacons/apple-colors";
import {
  getPersonDetail,
  getMovieCredits,
  profileUrl,
  type PersonDetail,
} from "@/services/tmdb";

export default function TributeIndex() {
  const [person, setPerson] = useState<PersonDetail | null>(null);
  const [filmCount, setFilmCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [personData, credits] = await Promise.all([
          getPersonDetail(),
          getMovieCredits(),
        ]);
        setPerson(personData);
        const seen = new Set<number>();
        for (const m of credits.cast) seen.add(m.id);
        setFilmCount(seen.size);
      } catch {
        // Silently fail, UI shows placeholder
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      </View>
    );
  }

  const birthYear = person?.birthday?.split("-")[0] ?? "1931";
  const deathYear = person?.deathday?.split("-")[0] ?? "2025";

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor: AC.systemGroupedBackground as any }}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Hero section */}
      <View style={{ alignItems: "center", padding: 24, gap: 16 }}>
        {person?.profile_path ? (
          <Image
            source={{ uri: profileUrl(person.profile_path) }}
            style={{
              width: 180,
              height: 240,
              borderRadius: 16,
              borderCurve: "continuous",
            }}
            contentFit="cover"
            transition={300}
          />
        ) : (
          <View
            style={{
              width: 180,
              height: 240,
              borderRadius: 16,
              borderCurve: "continuous",
              backgroundColor: AC.systemGray4 as any,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              source="sf:person.fill"
              style={{ fontSize: 48, color: AC.systemGray as any }}
            />
          </View>
        )}
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: AC.label as any,
            textAlign: "center",
          }}
        >
          Robert Duvall
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: AC.secondaryLabel as any,
            textAlign: "center",
          }}
        >
          {birthYear} – {deathYear}
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: AC.tertiaryLabel as any,
            textAlign: "center",
            fontStyle: "italic",
          }}
        >
          "I don't care about Hollywood. I just want to work."
        </Text>
      </View>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 16,
          borderRadius: 16,
          borderCurve: "continuous",
          backgroundColor: AC.secondarySystemGroupedBackground as any,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <StatItem
          icon="sf:film.fill"
          value={`${filmCount}`}
          label="Films"
          color={AC.systemBlue}
        />
        <StatItem
          icon="sf:trophy.fill"
          value="1"
          label="Oscar"
          color={AC.systemYellow}
        />
        <StatItem
          icon="sf:star.fill"
          value="7"
          label="Nominations"
          color={AC.systemOrange}
        />
      </View>

      {/* Biography */}
      <View style={{ padding: 16, gap: 12, marginTop: 8 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: AC.label as any,
          }}
        >
          Biography
        </Text>
        <Text
          selectable
          style={{
            fontSize: 15,
            lineHeight: 22,
            color: AC.secondaryLabel as any,
          }}
        >
          {person?.biography ||
            "Robert Selden Duvall was an American actor and filmmaker. Known for his commanding screen presence and versatility, he delivered iconic performances across six decades of cinema."}
        </Text>
      </View>

      {/* Notable Roles */}
      <View style={{ padding: 16, gap: 12 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: AC.label as any,
          }}
        >
          Iconic Roles
        </Text>
        {NOTABLE_ROLES.map((role) => (
          <View
            key={role.film}
            style={{
              flexDirection: "row",
              gap: 12,
              padding: 14,
              borderRadius: 12,
              borderCurve: "continuous",
              backgroundColor: AC.secondarySystemGroupedBackground as any,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <Image
              source="sf:film.circle.fill"
              style={{ fontSize: 28, color: AC.systemBlue as any }}
            />
            <View style={{ flex: 1, gap: 2 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: AC.label as any,
                }}
              >
                {role.character}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: AC.secondaryLabel as any,
                }}
              >
                {role.film} ({role.year})
              </Text>
              {role.note ? (
                <Text
                  style={{
                    fontSize: 13,
                    color: AC.systemOrange as any,
                    fontWeight: "500",
                    marginTop: 2,
                  }}
                >
                  {role.note}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      {/* Memorial */}
      <View
        style={{
          margin: 16,
          padding: 20,
          borderRadius: 16,
          borderCurve: "continuous",
          backgroundColor: AC.secondarySystemGroupedBackground as any,
          alignItems: "center",
          gap: 8,
        }}
      >
        <Image
          source="sf:heart.fill"
          style={{ fontSize: 28, color: AC.systemRed as any }}
        />
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: AC.label as any,
            textAlign: "center",
          }}
        >
          In Loving Memory
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: AC.secondaryLabel as any,
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          Robert Duvall left an indelible mark on cinema. His dedication to his
          craft and his ability to inhabit every character he portrayed made him
          one of the greatest actors in the history of film.
        </Text>
      </View>
    </ScrollView>
  );
}

function StatItem({
  icon,
  value,
  label,
  color,
}: {
  icon: string;
  value: string;
  label: string;
  color: any;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        padding: 16,
        gap: 6,
      }}
    >
      <Image source={icon} style={{ fontSize: 22, color: color as any }} />
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          color: AC.label as any,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
      <Text style={{ fontSize: 13, color: AC.secondaryLabel as any }}>
        {label}
      </Text>
    </View>
  );
}

const NOTABLE_ROLES = [
  {
    character: "Boo Radley",
    film: "To Kill a Mockingbird",
    year: "1962",
    note: "Film debut",
  },
  {
    character: "Tom Hagen",
    film: "The Godfather",
    year: "1972",
    note: "Academy Award Nomination",
  },
  {
    character: "Lt. Col. Bill Kilgore",
    film: "Apocalypse Now",
    year: "1979",
    note: "Academy Award Nomination",
  },
  {
    character: "Mac Sledge",
    film: "Tender Mercies",
    year: "1983",
    note: "Academy Award Winner — Best Actor",
  },
  {
    character: "Augustus McCrae",
    film: "Lonesome Dove",
    year: "1989",
    note: "Emmy Award Winner",
  },
  {
    character: "Bull Meechum",
    film: "The Great Santini",
    year: "1979",
    note: "Academy Award Nomination",
  },
];
