import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AssistantChatTransport, useChatRuntime } from '@assistant-ui/react-ai-sdk';
import {
  ActionBarPrimitive,
  AssistantRuntimeProvider,
  AuiIf,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadMessage,
  ThreadPrimitive,
  useAuiState,
} from '@assistant-ui/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PropsWithChildren, useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { appEnv, getApiSetupHint } from '@/core/env';
import { ChatMarkdown } from '@/features/chat/chat-markdown';
import { getChatPalette } from '@/features/chat/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { createThreadId, getThreads, saveThread } from '@/services/chat-storage';

function extractMessageText(message?: ThreadMessage): string {
  return (
    message?.content
      .filter((part) => part.type === 'text')
      .map((part) => ('text' in part ? part.text : ''))
      .join(' ')
      .trim() ?? ''
  );
}

function ConfiguredSampleChatRuntime({ children }: PropsWithChildren) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: `${appEnv.apiUrl}/api/chat`,
    }),
  });

  return <AssistantRuntimeProvider runtime={runtime}>{children}</AssistantRuntimeProvider>;
}

function SampleChatRuntime({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);

  if (!appEnv.apiUrl) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['top']}>
        <View style={styles.missingRuntime}>
          <View style={[styles.emptyIcon, { backgroundColor: palette.emptyIconBackground }]}>
            <MaterialIcons name="cloud-off" size={26} color={palette.accent} />
          </View>
          <Text style={[styles.missingRuntimeTitle, { color: palette.text }]}>API setup required</Text>
          <Text style={[styles.missingRuntimeText, { color: palette.textMuted }]}>{getApiSetupHint()}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return <ConfiguredSampleChatRuntime>{children}</ConfiguredSampleChatRuntime>;
}

function IconButton({
  icon,
  onPress,
  tint,
  backgroundColor,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  tint: string;
  backgroundColor: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.headerButton,
        {
          backgroundColor: pressed ? tint : backgroundColor,
        },
      ]}>
      {({ pressed }) => (
        <MaterialIcons name={icon} size={18} color={pressed ? '#FFFFFF' : tint} />
      )}
    </Pressable>
  );
}

function ChatHeader() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);

  return (
    <View style={[styles.header, { backgroundColor: palette.headerBackground, borderBottomColor: palette.separator }]}>
      <IconButton
        icon="arrow-back"
        onPress={() => {
          if (router.canGoBack()) {
            router.back();
            return;
          }

          router.replace('/samples/chat');
        }}
        tint={palette.text}
        backgroundColor={palette.iconSurface}
      />
      <Text style={[styles.chatHeaderTitle, { color: palette.text }]}>Chat</Text>
      <IconButton
        icon="edit"
        onPress={() =>
          router.replace({
            pathname: '/samples/chat/thread',
            params: { threadId: createThreadId() },
          })
        }
        tint={palette.text}
        backgroundColor={palette.iconSurface}
      />
    </View>
  );
}

function SuggestionPill({ prompt, label }: { prompt: string; label: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);

  return (
    <ThreadPrimitive.Suggestion
      prompt={prompt}
      send
      style={[
        styles.suggestionPill,
        {
          backgroundColor: palette.suggestionBackground,
          borderColor: palette.suggestionBorder,
        },
      ]}>
      <Text style={[styles.suggestionText, { color: palette.text }]}>{label}</Text>
    </ThreadPrimitive.Suggestion>
  );
}

function EmptyThreadState() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);

  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: palette.emptyIconBackground }]}>
        <MaterialIcons name="auto-awesome" size={26} color={palette.accent} />
      </View>
      <Text style={[styles.emptyTitle, { color: palette.text }]}>Hello there!</Text>
      <Text style={[styles.emptySubtitle, { color: palette.textMuted }]}>How can I help you today?</Text>
      <View style={styles.suggestionList}>
        <SuggestionPill prompt="What's the weather in Tokyo?" label="What's the weather in Tokyo?" />
        <SuggestionPill prompt="Tell me a joke." label="Tell me a joke" />
        <SuggestionPill
          prompt="Help me write an email to a client."
          label="Help me write an email"
        />
      </View>
    </View>
  );
}

function UserMessageBubble() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);

  return (
    <View style={styles.userShell}>
      <MessagePrimitive.Root
        style={[
          styles.userBubble,
          {
            backgroundColor: palette.userBubble,
          },
        ]}>
        <MessagePrimitive.Content
          renderText={({ part }) => (
            <Text style={[styles.userMessageText, { color: palette.userBubbleText }]}>{part.text}</Text>
          )}
        />
      </MessagePrimitive.Root>
    </View>
  );
}

function AssistantActions() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);

  return (
    <View style={styles.assistantActions}>
      <ActionBarPrimitive.Copy
        hitSlop={8}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: pressed ? palette.iconSurfaceStrong : palette.iconSurface },
        ]}>
        {({ isCopied }) => (
          <MaterialIcons
            name={isCopied ? 'check' : 'content-copy'}
            size={15}
            color={palette.textMuted}
          />
        )}
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload
        hitSlop={8}
        style={({ pressed }) => [
          styles.actionButton,
          { backgroundColor: pressed ? palette.iconSurfaceStrong : palette.iconSurface },
        ]}>
        <MaterialIcons name="refresh" size={15} color={palette.textMuted} />
      </ActionBarPrimitive.Reload>
    </View>
  );
}

function AssistantMessageBubble() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);

  return (
    <View style={styles.assistantShell}>
      <View style={[styles.assistantAvatar, { backgroundColor: palette.iconSurface }]}>
        <MaterialIcons name="auto-awesome" size={14} color={palette.textMuted} />
      </View>
      <View style={styles.assistantBody}>
        <MessagePrimitive.Root style={styles.assistantBubble}>
          <MessagePrimitive.Content
            renderText={({ part }) => <ChatMarkdown content={part.text} />}
            renderToolCall={({ part }) => (
              <View style={[styles.toolFallback, { backgroundColor: palette.surfaceStrong, borderColor: palette.border }]}>
                <Text style={[styles.toolFallbackTitle, { color: palette.text }]}>Tool call</Text>
                <Text style={[styles.toolFallbackText, { color: palette.textMuted }]}>{part.toolName}</Text>
              </View>
            )}
          />
          <AuiIf condition={(state) => state.thread.isRunning && state.message.isLast && state.message.content.length === 0}>
            <View style={styles.thinkingRow}>
              <ActivityIndicator size="small" color={palette.accent} />
              <Text style={[styles.thinkingText, { color: palette.textMuted }]}>Thinking...</Text>
            </View>
          </AuiIf>
        </MessagePrimitive.Root>
        <AssistantActions />
      </View>
    </View>
  );
}

function ComposerBar() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);
  const insets = useSafeAreaInsets();
  const isRunning = useAuiState((state) => state.thread.isRunning);

  return (
    <View
      style={[
        styles.composerShell,
        {
          backgroundColor: palette.headerBackground,
          borderTopColor: palette.separator,
          paddingBottom: Math.max(insets.bottom, 10),
        },
      ]}>
      <ComposerPrimitive.Root
        style={[
          styles.composerRoot,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}>
        <ComposerPrimitive.Input
          placeholder="Send a message..."
          placeholderTextColor={palette.textSoft}
          multiline
          style={[
            styles.textInput,
            {
              color: palette.text,
            },
          ]}
        />
        <View style={styles.composerActions}>
          <View style={[styles.leftComposerIcon, { backgroundColor: palette.iconSurface }]}>
            <MaterialIcons name="add" size={18} color={palette.textMuted} />
          </View>
          {isRunning ? (
            <ComposerPrimitive.Cancel
              style={({ pressed }) => [
                styles.sendButton,
                { backgroundColor: pressed ? '#0D8E70' : palette.accent },
              ]}>
              <MaterialIcons name="stop" size={14} color={palette.accentForeground} />
            </ComposerPrimitive.Cancel>
          ) : (
            <ComposerPrimitive.Send
              style={({ pressed }) => [
                styles.sendButton,
                { backgroundColor: pressed ? '#0D8E70' : palette.accent },
              ]}>
              <MaterialIcons name="arrow-upward" size={16} color={palette.accentForeground} />
            </ComposerPrimitive.Send>
          )}
        </View>
      </ComposerPrimitive.Root>
    </View>
  );
}

function SampleChatThread({ threadId }: { threadId: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = getChatPalette(colorScheme);
  const messages = useAuiState((state) => state.thread.messages) as readonly ThreadMessage[];

  useEffect(() => {
    if (messages.length === 0) return;

    const persist = async () => {
      const previous = await getThreads();
      const existing = previous.find((thread) => thread.id === threadId);
      const firstUserMessage = messages.find((message) => message.role === 'user');
      const lastMessage = messages[messages.length - 1];
      const title = extractMessageText(firstUserMessage).slice(0, 60) || 'Sample conversation';

      await saveThread({
        id: threadId,
        title,
        preview: extractMessageText(lastMessage).slice(0, 80),
        createdAt: existing?.createdAt ?? Date.now(),
        updatedAt: Date.now(),
      });
    };

    void persist();
  }, [messages, threadId]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]} edges={['top']}>
      <KeyboardAvoidingView
        style={[styles.safeArea, { backgroundColor: palette.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 6 : 0}>
        <ChatHeader />
        <ThreadPrimitive.Root style={styles.threadRoot}>
          <AuiIf condition={(state) => state.thread.isEmpty}>
            <EmptyThreadState />
          </AuiIf>
          <AuiIf condition={(state) => !state.thread.isEmpty}>
            <ThreadPrimitive.Messages
              components={{
                UserMessage: UserMessageBubble,
                AssistantMessage: AssistantMessageBubble,
              }}
              contentContainerStyle={styles.messageList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              style={styles.messageScroller}
            />
          </AuiIf>
        </ThreadPrimitive.Root>
        <ComposerBar />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function SampleChatThreadScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();

  return (
    <SampleChatRuntime>
      <SampleChatThread threadId={threadId ?? 'sample-thread'} />
    </SampleChatRuntime>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    minHeight: 58,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatHeaderTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
  },
  threadRoot: {
    flex: 1,
  },
  messageScroller: {
    flex: 1,
  },
  missingRuntime: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 28,
  },
  missingRuntimeTitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  missingRuntimeText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 6,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 31,
    lineHeight: 36,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 21,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 14,
  },
  suggestionList: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  suggestionPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 18,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 18,
    gap: 18,
  },
  userShell: {
    alignSelf: 'flex-end',
    maxWidth: '86%',
  },
  userBubble: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 24,
  },
  assistantShell: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
  },
  assistantAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  assistantBody: {
    flex: 1,
    gap: 10,
  },
  assistantBubble: {
    gap: 10,
  },
  assistantActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolFallback: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  toolFallbackTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  toolFallbackText: {
    fontSize: 13,
    lineHeight: 18,
  },
  thinkingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  thinkingText: {
    fontSize: 14,
    lineHeight: 18,
  },
  composerShell: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  composerRoot: {
    borderWidth: 1,
    borderRadius: 28,
    paddingTop: 6,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  textInput: {
    minHeight: 56,
    maxHeight: 140,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    fontSize: 16,
    lineHeight: 22,
  },
  composerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  leftComposerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
