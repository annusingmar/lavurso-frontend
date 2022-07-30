<template>
  <div class="row flex-center q-col-gutter-md" style="min-height: 75vh">
    <div class="col-md-5 col-sm-10" style="min-width: 0px">
      <GroupEditMembersList
        :loading="loading"
        :users="users"
        :group="group"
        @refresh-group="$emit('refreshGroup')"
      ></GroupEditMembersList>
    </div>
    <div class="col-md-3 col-sm-10">
      <GroupEditMembersAdd
        :users="users"
        :group="group"
        @refresh-group="$emit('refreshGroup')"
      ></GroupEditMembersAdd>
    </div>
  </div>
</template>

<script>
import GroupEditMembersList from "src/components/GroupEditMembersList.vue";
import GroupEditMembersAdd from "src/components/GroupEditMembersAdd.vue";

export default {
  name: "GroupEditMembers",
  props: ["users", "loading", "group"],
  emits: ["refreshGroup"],
  components: { GroupEditMembersList, GroupEditMembersAdd },
};
</script>
