import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  moderatorVerifyCard,
  removeModerationReview,
} from "metabase/query_builder/actions";

import SidebarContent from "metabase/query_builder/components/SidebarContent";
import QuestionActionButtons from "metabase/query_builder/components/QuestionActionButtons";
import { ClampedDescription } from "metabase/query_builder/components/ClampedDescription";
import {
  SidebarContentContainer,
  BorderedModerationActions,
  BorderedQuestionActivityTimeline,
} from "./QuestionDetailsSidebarPanel.styled";
import { PLUGIN_MODERATION } from "metabase/plugins";

const { ModerationReviewBanner } = PLUGIN_MODERATION;

const mapDispatchToProps = {
  moderatorVerifyCard,
  removeModerationReview,
};

export default connect(
  undefined,
  mapDispatchToProps,
)(QuestionDetailsSidebarPanel);

QuestionDetailsSidebarPanel.propTypes = {
  question: PropTypes.object.isRequired,
  onOpenModal: PropTypes.func.isRequired,
  moderatorVerifyCard: PropTypes.func.isRequired,
};

function QuestionDetailsSidebarPanel({
  question,
  onOpenModal,
  moderatorVerifyCard,
}) {
  const canWrite = question.canWrite();
  const description = question.description();
  const latestModerationReview = question.getLatestModerationReview();

  const onDescriptionEdit = canWrite
    ? () => {
        onOpenModal("edit");
      }
    : undefined;

  const onVerify = () => {
    const id = question.id();
    moderatorVerifyCard(id);
  };

  const onRemoveModerationReview = () => {
    removeModerationReview(latestModerationReview.id);
  };

  return (
    <SidebarContent>
      <SidebarContentContainer>
        <QuestionActionButtons canWrite={canWrite} onOpenModal={onOpenModal} />
        <ClampedDescription
          className="pb2"
          visibleLines={8}
          description={description}
          onEdit={onDescriptionEdit}
        />
        <BorderedModerationActions onVerify={onVerify} />
        {latestModerationReview && (
          <ModerationReviewBanner
            moderationReview={latestModerationReview}
            onRemove={onRemoveModerationReview}
          />
        )}
        <BorderedQuestionActivityTimeline question={question} />
      </SidebarContentContainer>
    </SidebarContent>
  );
}
