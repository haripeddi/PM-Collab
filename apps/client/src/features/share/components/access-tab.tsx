import { useState } from "react";
import { Box, Button, Divider, Group, Select, Stack, Text, TagsInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { MultiMemberSelect } from "@/features/space/components/multi-member-select";
import { SpaceMemberRole } from "@/features/space/components/space-member-role";
import { useAddSpaceMemberMutation } from "@/features/space/queries/space-query";
import { useCreateInvitationMutation } from "@/features/workspace/queries/workspace-query";
import { userRoleData } from "@/features/workspace/types/user-role-data";
import { SpaceRole, UserRole } from "@/lib/types";

type AccessTabProps = {
  spaceId?: string;
  spaceName?: string;
};

// Non-EE fallback for the Share modal's Access tab: page-level permissions
// require an enterprise license, so this grants access at the space level
// instead, using the same member/invite mutations the Space settings page
// already relies on.
export function AccessTab({ spaceId, spaceName }: AccessTabProps) {
  const { t } = useTranslation();

  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [memberRole, setMemberRole] = useState<string>(SpaceRole.WRITER);
  const addSpaceMemberMutation = useAddSpaceMemberMutation();

  const handleAddMembers = async () => {
    if (memberIds.length === 0 || !spaceId) return;

    const userIds = memberIds
      .filter((id) => id.startsWith("user-"))
      .map((id) => id.replace("user-", ""));
    const groupIds = memberIds
      .filter((id) => id.startsWith("group-"))
      .map((id) => id.replace("group-", ""));

    const addSpaceMember = {
      spaceId,
      role: memberRole,
      ...(userIds.length > 0 && { userIds }),
      ...(groupIds.length > 0 && { groupIds }),
    };
    await addSpaceMemberMutation.mutateAsync(addSpaceMember);
    setMemberIds([]);
  };

  const [emails, setEmails] = useState<string[]>([]);
  const [inviteRole, setInviteRole] = useState<string>(UserRole.MEMBER);
  const createInvitationMutation = useCreateInvitationMutation();

  const handleInvite = async () => {
    const validEmails = emails.filter((email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    );
    if (validEmails.length === 0) return;

    await createInvitationMutation.mutateAsync({
      role: inviteRole.toLowerCase(),
      emails: validEmails,
      groupIds: [],
    });
    setEmails([]);
  };

  return (
    <Stack gap="md">
      <Box>
        <Text size="sm" fw={500}>
          {t("Add existing members")}
        </Text>
        <Text size="xs" c="dimmed" mb={8}>
          {spaceName
            ? t('Give people already in your workspace access to "{{space}}".', {
                space: spaceName,
              })
            : t("Give people already in your workspace access to this space.")}
        </Text>
        <Group gap="xs" align="flex-end">
          <Box style={{ flex: 1 }}>
            <MultiMemberSelect value={memberIds} onChange={setMemberIds} />
          </Box>
          <SpaceMemberRole onSelect={setMemberRole} defaultRole={memberRole} />
          <Button
            onClick={handleAddMembers}
            disabled={memberIds.length === 0}
            loading={addSpaceMemberMutation.isPending}
          >
            {t("Add")}
          </Button>
        </Group>
      </Box>

      <Divider />

      <Box>
        <Text size="sm" fw={500}>
          {t("Invite by email")}
        </Text>
        <Text size="xs" c="dimmed" mb={8}>
          {t("Invite someone new to the workspace so they can access this page.")}
        </Text>
        <TagsInput
          placeholder={t("Enter email addresses")}
          variant="filled"
          splitChars={[",", " "]}
          maxTags={50}
          value={emails}
          onChange={setEmails}
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
        />
        <Group justify="flex-end" mt="sm">
          <Select
            data={userRoleData
              .filter((r) => r.value !== UserRole.OWNER)
              .map((r) => ({ ...r, label: t(r.label) }))}
            value={inviteRole}
            onChange={(value) => value && setInviteRole(value)}
            allowDeselect={false}
            variant="filled"
            w={140}
          />
          <Button
            onClick={handleInvite}
            disabled={emails.length === 0}
            loading={createInvitationMutation.isPending}
          >
            {t("Send invite")}
          </Button>
        </Group>
      </Box>
    </Stack>
  );
}
