import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createThreadId, deleteThread, getThreads, type ChatThread } from '@/services/chat-storage';
import { getChatPalette } from '@/features/chat/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function formatDate(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function startNewChat() {
  router.push({
    pathname: '/samples/chat/thread',
    params: { threadId: createThreadId() },
  });
}

export default function SampleChatIndexScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);
  const [threads, setThreads] = useState<ChatThread[]>([]);

  useFocusEffect(
    useCallback(() => {
      getThreads().then(setThreads);
    }, [])
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['top']}>
      <View style={[styles.container, { backgroundColor: palette.background }]}>
        <View style={[styles.header, { borderBottomColor: palette.separator }]}>
          <View style={styles.headerText}>
            <Text style={[styles.headerEyebrow, { color: palette.textSoft }]}>assistant-ui sample</Text>
            <Text style={[styles.headerTitle, { color: palette.text }]}>Chats</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={startNewChat}
            style={({ pressed }) => [
              styles.headerButton,
              {
                backgroundColor: pressed ? palette.iconSurfaceStrong : palette.iconSurface,
              },
            ]}>
            <MaterialIcons name="edit" size={18} color={palette.text} />
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={startNewChat}
          style={({ pressed }) => [
            styles.primaryButton,
            {
              backgroundColor: pressed ? palette.accent : palette.surface,
              borderColor: pressed ? palette.accent : palette.border,
            },
          ]}>
          {({ pressed }) => (
            <>
              <View
                style={[
                  styles.primaryButtonIcon,
                  {
                    backgroundColor: pressed ? 'rgba(255,255,255,0.2)' : palette.emptyIconBackground,
                  },
                ]}>
                <MaterialIcons
                  name="add-comment"
                  size={18}
                  color={pressed ? palette.accentForeground : palette.accent}
                />
              </View>
              <View style={styles.primaryButtonText}>
                <Text
                  style={[
                    styles.primaryButtonTitle,
                    { color: pressed ? palette.accentForeground : palette.text },
                  ]}>
                  New chat
                </Text>
                <Text
                  style={[
                    styles.primaryButtonDescription,
                    { color: pressed ? 'rgba(255,255,255,0.78)' : palette.textMuted },
                  ]}>
                  Start a fresh conversation with the sample assistant.
                </Text>
              </View>
            </>
          )}
        </Pressable>

        <View style={styles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: palette.text }]}>Recent</Text>
          <Text style={[styles.sectionHint, { color: palette.textSoft }]}>Long press to delete</Text>
        </View>

        {threads.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: palette.emptyIconBackground }]}>
              <MaterialIcons name="forum" size={28} color={palette.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: palette.text }]}>No conversations yet</Text>
            <Text style={[styles.emptyText, { color: palette.textMuted }]}>
              Start a new chat to build up a ChatGPT-like thread history in this sample stack.
            </Text>
          </View>
        ) : (
          <FlatList
            data={threads}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                onLongPress={async () => {
                  await deleteThread(item.id);
                  setThreads((prev) => prev.filter((thread) => thread.id !== item.id));
                }}
                onPress={() =>
                  router.push({
                    pathname: '/samples/chat/thread',
                    params: { threadId: item.id },
                  })
                }
                style={({ pressed }) => [
                  styles.threadRow,
                  {
                    backgroundColor: pressed ? palette.listPressed : palette.surface,
                    borderColor: palette.border,
                  },
                ]}>
                <View style={[styles.threadIcon, { backgroundColor: palette.iconSurface }]}>
                  <MaterialIcons name="chat-bubble-outline" size={18} color={palette.textMuted} />
                </View>
                <View style={styles.threadContent}>
                  <Text style={[styles.threadTitle, { color: palette.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={[styles.threadPreview, { color: palette.textMuted }]} numberOfLines={1}>
                    {item.preview || 'No preview yet'}
                  </Text>
                </View>
                <Text style={[styles.threadDate, { color: palette.textSoft }]}>{formatDate(item.updatedAt)}</Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    gap: 2,
  },
  headerEyebrow: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  headerTitle: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '700',
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 72,
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryButtonIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    flex: 1,
    gap: 2,
  },
  primaryButtonTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  primaryButtonDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  sectionHint: {
    fontSize: 12,
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 28,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  list: {
    gap: 10,
    paddingBottom: 12,
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  threadIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  threadContent: {
    flex: 1,
    gap: 2,
  },
  threadTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  threadPreview: {
    fontSize: 13,
    lineHeight: 18,
  },
  threadDate: {
    fontSize: 12,
    lineHeight: 16,
  },
});
