const periodEl = document.getElementById("dash-period");
const userTitleEl = document.getElementById("dash-user-title");
const balanceHeadEl = document.getElementById("dash-balance-head");
const entriesMetaEl = document.getElementById("dash-entries-meta");
const errorEl = document.getElementById("dash-error");
const infoEl = document.getElementById("dash-info");
const logoutBtn = document.getElementById("dash-logout-menu");
const refreshBtn = document.getElementById("dash-refresh-menu");
const notificationsMenuBtn = document.getElementById("dash-notifications-menu");
const supportTopBadgeEl = document.getElementById("dash-support-badge");
const notificationsMenuBadgeEl = document.getElementById("dash-notifications-badge");
const profileMenuBtn = document.getElementById("dash-profile-menu");
const passwordMenuBtn = document.getElementById("dash-password-menu");
const adminMenuBtn = document.getElementById("dash-admin-menu");
const adminTabBtn = document.getElementById("dash-admin-tab");
const adminInfoEl = document.getElementById("admin-area-info");
const adminActionButtons = Array.from(document.querySelectorAll("[data-admin-action]"));
const adminCategoriesModal = document.getElementById("admin-categories-modal");
const closeAdminCategoriesModalBtn = document.getElementById("close-admin-categories-modal");
const cancelAdminCategoriesModalBtn = document.getElementById("cancel-admin-categories-modal");
const openAdminCategoryEditorNewBtn = document.getElementById("open-admin-category-editor-new");
const adminCategoryEditorModal = document.getElementById("admin-category-editor-modal");
const closeAdminCategoryEditorModalBtn = document.getElementById("close-admin-category-editor-modal");
const cancelAdminCategoryEditorModalBtn = document.getElementById("cancel-admin-category-editor-modal");
const saveAdminCategoryModalBtn = document.getElementById("save-admin-category-modal");
const deleteAdminCategoryModalBtn = document.getElementById("delete-admin-category-modal");
const adminCategoryNameInput = document.getElementById("admin-category-name");
const openAdminCategoryTypeBtn = document.getElementById("open-admin-category-type");
const selectedAdminCategoryTypeEl = document.getElementById("selected-admin-category-type");
const adminCategoryAlterdataInput = document.getElementById("admin-category-alterdata");
const adminCategoryStatsEl = document.getElementById("admin-category-stats");
const adminCategoriesListEl = document.getElementById("admin-categories-list");
const adminCategoryTypeModal = document.getElementById("admin-category-type-modal");
const closeAdminCategoryTypeModalBtn = document.getElementById("close-admin-category-type-modal");
const adminCategoryTypeListEl = document.getElementById("admin-category-type-list");
const adminUsersModal = document.getElementById("admin-users-modal");
const closeAdminUsersModalBtn = document.getElementById("close-admin-users-modal");
const cancelAdminUsersModalBtn = document.getElementById("cancel-admin-users-modal");
const openAdminUserEditorNewBtn = document.getElementById("open-admin-user-editor-new");
const adminPendingEntriesBadgeEl = document.getElementById("admin-pending-entries-badge");
const adminPendingEntriesModal = document.getElementById("admin-pending-entries-modal");
const closeAdminPendingEntriesModalBtn = document.getElementById("close-admin-pending-entries-modal");
const cancelAdminPendingEntriesModalBtn = document.getElementById("cancel-admin-pending-entries-modal");
const adminPendingEntriesListEl = document.getElementById("admin-pending-entries-list");
const adminImpersonateModal = document.getElementById("admin-impersonate-modal");
const closeAdminImpersonateModalBtn = document.getElementById("close-admin-impersonate-modal");
const cancelAdminImpersonateModalBtn = document.getElementById("cancel-admin-impersonate-modal");
const saveAdminImpersonateModalBtn = document.getElementById("save-admin-impersonate-modal");
const adminImpersonateListEl = document.getElementById("admin-impersonate-list");
const adminUserEditorModal = document.getElementById("admin-user-editor-modal");
const closeAdminUserEditorModalBtn = document.getElementById("close-admin-user-editor-modal");
const cancelAdminUserEditorModalBtn = document.getElementById("cancel-admin-user-editor-modal");
const saveAdminUserModalBtn = document.getElementById("save-admin-user-modal");
const deleteAdminUserModalBtn = document.getElementById("delete-admin-user-modal");
const adminUserNameInput = document.getElementById("admin-user-name");
const adminUserEmailInput = document.getElementById("admin-user-email");
const adminUserPasswordInput = document.getElementById("admin-user-password");
const openAdminUserRoleBtn = document.getElementById("open-admin-user-role");
const selectedAdminUserRoleEl = document.getElementById("selected-admin-user-role");
const adminUserAlterdataInput = document.getElementById("admin-user-alterdata");
const adminUserStatsEl = document.getElementById("admin-user-stats");
const adminUsersListEl = document.getElementById("admin-users-list");
const adminUserRoleModal = document.getElementById("admin-user-role-modal");
const closeAdminUserRoleModalBtn = document.getElementById("close-admin-user-role-modal");
const adminUserRoleListEl = document.getElementById("admin-user-role-list");
const adminCloseMonthModal = document.getElementById("admin-close-month-modal");
const closeAdminCloseMonthModalBtn = document.getElementById("close-admin-close-month-modal");
const cancelAdminCloseMonthModalBtn = document.getElementById("cancel-admin-close-month-modal");
const saveAdminCloseMonthModalBtn = document.getElementById("save-admin-close-month-modal");
const openAdminCloseMonthDateBtn = document.getElementById("open-admin-close-month-date");
const selectedAdminCloseMonthDateEl = document.getElementById("selected-admin-close-month-date");
const openAdminCloseMonthUsersBtn = document.getElementById("open-admin-close-month-users");
const selectedAdminCloseMonthUsersEl = document.getElementById("selected-admin-close-month-users");
const adminCloseMonthUsersEl = document.getElementById("admin-close-month-users");
const adminCloseMonthHistoryEl = document.getElementById("admin-close-month-history");
const adminCloseMonthDateModal = document.getElementById("admin-close-month-date-modal");
const closeAdminCloseMonthDateModalBtn = document.getElementById("close-admin-close-month-date-modal");
const adminCloseMonthDatePicker = document.getElementById("admin-close-month-date-picker");
const adminCloseMonthUserModal = document.getElementById("admin-close-month-user-modal");
const closeAdminCloseMonthUserModalBtn = document.getElementById("close-admin-close-month-user-modal");
const adminExportModal = document.getElementById("admin-export-modal");
const closeAdminExportModalBtn = document.getElementById("close-admin-export-modal");
const cancelAdminExportModalBtn = document.getElementById("cancel-admin-export-modal");
const saveAdminExportModalBtn = document.getElementById("save-admin-export-modal");
const openAdminExportMonthBtn = document.getElementById("open-admin-export-month");
const selectedAdminExportMonthEl = document.getElementById("selected-admin-export-month");
const openAdminExportTypeBtn = document.getElementById("open-admin-export-type");
const selectedAdminExportTypeEl = document.getElementById("selected-admin-export-type");
const openAdminExportUserBtn = document.getElementById("open-admin-export-user");
const selectedAdminExportUserEl = document.getElementById("selected-admin-export-user");
const adminExportMonthModal = document.getElementById("admin-export-month-modal");
const closeAdminExportMonthModalBtn = document.getElementById("close-admin-export-month-modal");
const adminExportMonthPicker = document.getElementById("admin-export-month-picker");
const adminExportTypeModal = document.getElementById("admin-export-type-modal");
const closeAdminExportTypeModalBtn = document.getElementById("close-admin-export-type-modal");
const adminExportTypeListEl = document.getElementById("admin-export-type-list");
const adminExportUserModal = document.getElementById("admin-export-user-modal");
const closeAdminExportUserModalBtn = document.getElementById("close-admin-export-user-modal");
const adminExportUserListEl = document.getElementById("admin-export-user-list");
const adminExportHistoryEl = document.getElementById("admin-export-history");
const adminAlterdataConfigModal = document.getElementById("admin-alterdata-config-modal");
const closeAdminAlterdataConfigModalBtn = document.getElementById("close-admin-alterdata-config-modal");
const cancelAdminAlterdataConfigModalBtn = document.getElementById("cancel-admin-alterdata-config-modal");
const adminAlterdataConfigListEl = document.getElementById("admin-alterdata-config-list");
const adminAlterdataColumnModal = document.getElementById("admin-alterdata-column-modal");
const closeAdminAlterdataColumnModalBtn = document.getElementById("close-admin-alterdata-column-modal");
const cancelAdminAlterdataColumnModalBtn = document.getElementById("cancel-admin-alterdata-column-modal");
const saveAdminAlterdataColumnModalBtn = document.getElementById("save-admin-alterdata-column-modal");
const adminAlterdataColumnTitleEl = document.getElementById("admin-alterdata-column-title");
const openAdminAlterdataSourceModalBtn = document.getElementById("open-admin-alterdata-source-modal");
const selectedAdminAlterdataSourceEl = document.getElementById("selected-admin-alterdata-source");
const openAdminAlterdataFieldModalBtn = document.getElementById("open-admin-alterdata-field-modal");
const selectedAdminAlterdataFieldEl = document.getElementById("selected-admin-alterdata-field");
const adminAlterdataFixedWrapEl = document.getElementById("admin-alterdata-fixed-wrap");
const adminAlterdataFixedValueInput = document.getElementById("admin-alterdata-fixed-value");
const adminAlterdataSourceModal = document.getElementById("admin-alterdata-source-modal");
const closeAdminAlterdataSourceModalBtn = document.getElementById("close-admin-alterdata-source-modal");
const adminAlterdataSourceListEl = document.getElementById("admin-alterdata-source-list");
const adminAlterdataFieldModal = document.getElementById("admin-alterdata-field-modal");
const closeAdminAlterdataFieldModalBtn = document.getElementById("close-admin-alterdata-field-modal");
const adminAlterdataFieldListEl = document.getElementById("admin-alterdata-field-list");
const dashMenuUserNameEl = document.getElementById("dash-menu-user-name");
const dashMenuUserEmailEl = document.getElementById("dash-menu-user-email");
const dashMenuUserMetaEl = document.getElementById("dash-menu-user-meta");

const kpiBalance = document.getElementById("kpi-balance");
const trendLabel = document.getElementById("kpi-trend-label");
const budgetLine = document.getElementById("dash-budget-line");
const trendLine = document.getElementById("dash-trend-line");

const reviewList = document.getElementById("review-list");
const reviewActionEl = document.getElementById("review-action");
const nextList = document.getElementById("next-list");
const catGrid = document.getElementById("cat-grid");
const categoriesListScreen = document.getElementById("categories-list-screen");
const accountsListScreen = document.getElementById("accounts-list-screen");
const recurrencesListScreen = document.getElementById("recurrences-list");
const recurrenceMetaEl = document.getElementById("recurrence-meta");
const catSoFarEl = document.getElementById("cat-so-far");
const catSoFarLabelEl = document.getElementById("cat-so-far-label");
const catLastMonthEl = document.getElementById("cat-last-month");
const catLastMonthLabelEl = document.getElementById("cat-last-month-label");
const catSummaryExtraEl = document.getElementById("cat-summary-extra");
const catSummaryExtraValueEl = document.getElementById("cat-summary-extra-value");
const catDonutEl = document.getElementById("cat-donut");
const entriesList = document.getElementById("entries-list");
const entriesSearchInput = document.getElementById("entries-search-input");
const txSearchOverlay = document.getElementById("tx-search-overlay");
const catSummaryOverlay = document.getElementById("cat-summary-overlay");
const catSummaryCardEl = catSummaryOverlay?.querySelector(".cat-summary");
const filterPanel = document.querySelector(".tx-filter-panel");
const filterPanelPeriod = document.getElementById("entries-filter-panel-period");
const openEntryFiltersSummaryBtn = document.getElementById("open-entry-filters-summary");

const entriesFilterModal = document.getElementById("entries-filter-modal");
const closeEntryFiltersBtn = document.getElementById("close-entry-filters");
const cancelEntryFiltersBtn = document.getElementById("cancel-entry-filters");
const clearEntryFiltersBtn = document.getElementById("clear-entry-filters");
const applyEntryFiltersBtn = document.getElementById("apply-entry-filters");
const entriesFilterType = document.getElementById("entries-filter-type");
const entriesFilterStatus = document.getElementById("entries-filter-status");
const entriesFilterCategories = document.getElementById("entries-filter-categories");

const openEntriesFilterStartDateBtn = document.getElementById("open-entries-filter-start-date");
const openEntriesFilterEndDateBtn = document.getElementById("open-entries-filter-end-date");
const selectedEntriesFilterStartDateEl = document.getElementById("selected-entries-filter-start-date");
const selectedEntriesFilterEndDateEl = document.getElementById("selected-entries-filter-end-date");
const entriesFilterStartDateModal = document.getElementById("entries-filter-start-date-modal");
const entriesFilterEndDateModal = document.getElementById("entries-filter-end-date-modal");
const closeEntriesFilterStartDateModalBtn = document.getElementById("close-entries-filter-start-date-modal");
const closeEntriesFilterEndDateModalBtn = document.getElementById("close-entries-filter-end-date-modal");
const entriesFilterStartDatePicker = document.getElementById("entries-filter-start-date-picker");
const entriesFilterEndDatePicker = document.getElementById("entries-filter-end-date-picker");
const confirmActionModalEl = document.getElementById("confirm-action-modal");
const confirmActionTitleEl = document.getElementById("confirm-action-title");
const confirmActionMessageEl = document.getElementById("confirm-action-message");
const closeConfirmActionModalBtn = document.getElementById("close-confirm-action-modal");
const cancelConfirmActionBtn = document.getElementById("cancel-confirm-action");
const confirmConfirmActionBtn = document.getElementById("confirm-confirm-action");

const tabButtons = Array.from(document.querySelectorAll(".dash-tab"));
const tabSections = Array.from(document.querySelectorAll("[data-tab-content]"));
const dashHeaderEl = document.querySelector(".dash-header");
const tabNavShell = document.querySelector(".dash-nav-shell");
const tabNavWrap = document.querySelector(".dash-nav-wrap");
const rootApp = document.querySelector("ion-app");
const pageLoadingOverlay = document.getElementById("page-loading-overlay");
const notificationsModal = document.getElementById("notifications-modal");
const closeNotificationsModalBtn = document.getElementById("close-notifications-modal");
const notificationsListEl = document.getElementById("notifications-list");
const profileModal = document.getElementById("profile-modal");
const closeProfileModalBtn = document.getElementById("close-profile-modal");
const cancelProfileModalBtn = document.getElementById("cancel-profile-modal");
const saveProfileModalBtn = document.getElementById("save-profile-modal");
const profileNameInput = document.getElementById("profile-name");
const profileEmailInput = document.getElementById("profile-email");
const passwordModal = document.getElementById("password-modal");
const closePasswordModalBtn = document.getElementById("close-password-modal");
const cancelPasswordModalBtn = document.getElementById("cancel-password-modal");
const savePasswordModalBtn = document.getElementById("save-password-modal");
const passwordCurrentInput = document.getElementById("password-current");
const passwordNextInput = document.getElementById("password-next");
const passwordConfirmInput = document.getElementById("password-confirm");
const impersonationBannerEl = document.getElementById("impersonation-banner");
const impersonationBannerTextEl = document.getElementById("impersonation-banner-text");
const stopImpersonationBtn = document.getElementById("stop-impersonation-btn");
const supportMenuBtn = document.getElementById("dash-support-btn");
const supportModal = document.getElementById("support-modal");
const closeSupportModalBtn = document.getElementById("close-support-modal");
const openSupportThreadPickerBtn = document.getElementById("open-support-thread-picker");
const selectedSupportThreadEl = document.getElementById("selected-support-thread");
const supportThreadEmptyEl = document.getElementById("support-thread-empty");
const supportMessagesEl = document.getElementById("support-messages");
const supportMessageInput = document.getElementById("support-message-input");
const openSupportAttachModalBtn = document.getElementById("open-support-attach-modal");
const supportRecordAudioBtn = document.getElementById("support-record-audio");
const supportRecordingIndicatorEl = document.getElementById("support-recording-indicator");
const supportSendMessageBtn = document.getElementById("support-send-message");
const supportAttachmentFileInput = document.getElementById("support-attachment-file");
const supportAttachmentPreviewEl = document.getElementById("support-attachment-preview");
const supportAttachmentTitleEl = document.getElementById("support-attachment-title");
const clearSupportAttachmentBtn = document.getElementById("clear-support-attachment");
const supportThreadModal = document.getElementById("support-thread-modal");
const closeSupportThreadModalBtn = document.getElementById("close-support-thread-modal");
const supportThreadListEl = document.getElementById("support-thread-list");
const supportAttachModal = document.getElementById("support-attach-modal");
const closeSupportAttachModalBtn = document.getElementById("close-support-attach-modal");
const supportAttachListEl = document.getElementById("support-attach-list");
const supportEntityModal = document.getElementById("support-entity-modal");
const closeSupportEntityModalBtn = document.getElementById("close-support-entity-modal");
const supportEntityModalTitleEl = document.getElementById("support-entity-modal-title");
const supportEntitySearchInput = document.getElementById("support-entity-search");
const supportEntityListEl = document.getElementById("support-entity-list");

const entryModal = document.getElementById("entry-modal");
const openEntryBtn = document.getElementById("open-entry");
const openEntryInlineBtn = document.getElementById("open-entry-inline");
const closeEntryBtn = document.getElementById("close-entry");
const cancelEntryBtn = document.getElementById("cancel-entry");
const deleteEntryBtn = document.getElementById("delete-entry");
const saveEntryBtn = document.getElementById("save-entry");
const restoreEntryBtn = document.getElementById("restore-entry");
const entryModalTitleEl = document.getElementById("entry-modal-title");
const entryTypeInput = document.getElementById("entry-type");
const entryAmountInput = document.getElementById("entry-amount");
const openCategoryBtn = document.getElementById("open-category");
const selectedCategoryEl = document.getElementById("selected-category");
const categoryModal = document.getElementById("entry-category-modal");
const closeCategoryModalBtn = document.getElementById("close-category-modal");
const categorySearchInput = document.getElementById("category-search");
const categoryListEl = document.getElementById("category-list");
const openAccountBtn = document.getElementById("open-account");
const selectedAccountEl = document.getElementById("selected-account");
const accountModal = document.getElementById("entry-account-modal");
const closeAccountModalBtn = document.getElementById("close-account-modal");
const accountSearchInput = document.getElementById("account-search");
const accountListEl = document.getElementById("account-list");
const openUserCategoryModalBtn = document.getElementById("open-user-category-modal");
const openUserAccountModalBtn = document.getElementById("open-user-account-modal");
const userCategoryModal = document.getElementById("user-category-modal");
const closeUserCategoryModalBtn = document.getElementById("close-user-category-modal");
const cancelUserCategoryBtn = document.getElementById("cancel-user-category");
const saveUserCategoryBtn = document.getElementById("save-user-category");
const userCategoryModalTitleEl = document.getElementById("user-category-modal-title");
const userCategoryNameInput = document.getElementById("user-category-name");
const openUserCategoryIconModalBtn = document.getElementById("open-user-category-icon-modal");
const selectedUserCategoryIconGlyphEl = document.getElementById("selected-user-category-icon-glyph");
const selectedUserCategoryIconTextEl = document.getElementById("selected-user-category-icon-text");
const userCategoryIconModal = document.getElementById("user-category-icon-modal");
const closeUserCategoryIconModalBtn = document.getElementById("close-user-category-icon-modal");
const userCategoryIconListEl = document.getElementById("user-category-icon-list");
const openUserCategoryGlobalModalBtn = document.getElementById("open-user-category-global-modal");
const selectedUserCategoryGlobalEl = document.getElementById("selected-user-category-global");
const userCategoryGlobalModal = document.getElementById("user-category-global-modal");
const closeUserCategoryGlobalModalBtn = document.getElementById("close-user-category-global-modal");
const userCategoryGlobalSearchInput = document.getElementById("user-category-global-search");
const userCategoryGlobalListEl = document.getElementById("user-category-global-list");
const userAccountModal = document.getElementById("user-account-modal");
const closeUserAccountModalBtn = document.getElementById("close-user-account-modal");
const cancelUserAccountBtn = document.getElementById("cancel-user-account");
const saveUserAccountBtn = document.getElementById("save-user-account");
const userAccountModalTitleEl = document.getElementById("user-account-modal-title");
const userAccountNameInput = document.getElementById("user-account-name");
const userAccountInitialBalanceInput = document.getElementById("user-account-initial-balance");
const userAccountTypeInput = document.getElementById("user-account-type");
const openUserAccountIconModalBtn = document.getElementById("open-user-account-icon-modal");
const selectedUserAccountIconGlyphEl = document.getElementById("selected-user-account-icon-glyph");
const selectedUserAccountIconTextEl = document.getElementById("selected-user-account-icon-text");
const userAccountIconModal = document.getElementById("user-account-icon-modal");
const closeUserAccountIconModalBtn = document.getElementById("close-user-account-icon-modal");
const userAccountIconListEl = document.getElementById("user-account-icon-list");
const categoryDetailModal = document.getElementById("category-detail-modal");
const closeCategoryDetailModalBtn = document.getElementById("close-category-detail-modal");
const editCategoryFromDetailBtn = document.getElementById("edit-category-from-detail");
const deleteCategoryFromDetailBtn = document.getElementById("delete-category-from-detail");
const categoryDetailFooterEl = categoryDetailModal?.querySelector("ion-footer");
const categoryDetailTitleEl = document.getElementById("category-detail-title");
const categoryDetailGlobalNameEl = document.getElementById("category-detail-global-name");
const categoryDetailTotalEl = document.getElementById("category-detail-total");
const categoryDetailBarsEl = document.getElementById("category-detail-bars");
const categoryDetailListEl = document.getElementById("category-detail-list");
const accountDetailModal = document.getElementById("account-detail-modal");
const closeAccountDetailModalBtn = document.getElementById("close-account-detail-modal");
const editAccountFromDetailBtn = document.getElementById("edit-account-from-detail");
const deleteAccountFromDetailBtn = document.getElementById("delete-account-from-detail");
const accountDetailFooterEl = accountDetailModal?.querySelector("ion-footer");
const accountDetailTitleEl = document.getElementById("account-detail-title");
const accountDetailTotalEl = document.getElementById("account-detail-total");
const accountDetailBarsEl = document.getElementById("account-detail-bars");
const accountDetailListEl = document.getElementById("account-detail-list");
const entryDescriptionInput = document.getElementById("entry-description");
const openEntryRecurrenceBtn = document.getElementById("open-entry-recurrence");
const selectedEntryRecurrenceEl = document.getElementById("selected-entry-recurrence");
const entryRecurrenceModal = document.getElementById("entry-recurrence-modal");
const closeEntryRecurrenceModalBtn = document.getElementById("close-entry-recurrence-modal");
const entryRecurrenceListEl = document.getElementById("entry-recurrence-list");
const openDateBtn = document.getElementById("open-date");
const selectedDateEl = document.getElementById("selected-date");
const dateModal = document.getElementById("entry-date-modal");
const closeDateModalBtn = document.getElementById("close-date-modal");
const datePicker = document.getElementById("entry-date-picker");
const openAttachmentBtn = document.getElementById("open-attachment");
const attachmentInput = document.getElementById("entry-attachment-file");
const attachmentNameEl = document.getElementById("attachment-name");
const attachmentPreview = document.getElementById("attachment-preview");
const attachmentPreviewImage = document.getElementById("attachment-preview-image");
const attachmentPreviewPdf = document.getElementById("attachment-preview-pdf");
const attachmentPreviewName = document.getElementById("attachment-preview-name");
const clearAttachmentBtn = document.getElementById("clear-attachment");
const attachmentViewerModal = document.getElementById("attachment-viewer-modal");
const closeAttachmentViewerBtn = document.getElementById("close-attachment-viewer");
const attachmentViewerImage = document.getElementById("attachment-viewer-image");
const attachmentViewerPdf = document.getElementById("attachment-viewer-pdf");
const attachmentPathWrapEl = document.getElementById("attachment-path-wrap");
const attachmentPathEl = document.getElementById("attachment-path");
const recurrenceModal = document.getElementById("recurrence-modal");
const openRecurrenceInlineBtn = document.getElementById("open-recurrence-inline");
const closeRecurrenceBtn = document.getElementById("close-recurrence");
const cancelRecurrenceBtn = document.getElementById("cancel-recurrence");
const saveRecurrenceBtn = document.getElementById("save-recurrence");
const deleteRecurrenceBtn = document.getElementById("delete-recurrence");
const recurrenceModalTitleEl = document.getElementById("recurrence-modal-title");
const recurrenceAmountInput = document.getElementById("recurrence-amount");
const openRecurrenceCategoryBtn = document.getElementById("open-recurrence-category");
const selectedRecurrenceCategoryEl = document.getElementById("selected-recurrence-category");
const recurrenceCategoryModal = document.getElementById("recurrence-category-modal");
const closeRecurrenceCategoryModalBtn = document.getElementById("close-recurrence-category-modal");
const recurrenceCategorySearchInput = document.getElementById("recurrence-category-search");
const recurrenceCategoryListEl = document.getElementById("recurrence-category-list");
const openRecurrenceAccountBtn = document.getElementById("open-recurrence-account");
const selectedRecurrenceAccountEl = document.getElementById("selected-recurrence-account");
const recurrenceAccountModal = document.getElementById("recurrence-account-modal");
const closeRecurrenceAccountModalBtn = document.getElementById("close-recurrence-account-modal");
const recurrenceAccountSearchInput = document.getElementById("recurrence-account-search");
const recurrenceAccountListEl = document.getElementById("recurrence-account-list");
const openRecurrenceDateBtn = document.getElementById("open-recurrence-date");
const selectedRecurrenceDateEl = document.getElementById("selected-recurrence-date");
const recurrenceDateModal = document.getElementById("recurrence-date-modal");
const closeRecurrenceDateModalBtn = document.getElementById("close-recurrence-date-modal");
const recurrenceDatePicker = document.getElementById("recurrence-date-picker");
const openRecurrenceFrequencyBtn = document.getElementById("open-recurrence-frequency");
const selectedRecurrenceFrequencyEl = document.getElementById("selected-recurrence-frequency");
const recurrenceFrequencyModal = document.getElementById("recurrence-frequency-modal");
const closeRecurrenceFrequencyModalBtn = document.getElementById("close-recurrence-frequency-modal");
const recurrenceFrequencyListEl = document.getElementById("recurrence-frequency-list");
const recurrenceDescriptionInput = document.getElementById("recurrence-description");
const recurrenceEditorHistorySectionEl = document.getElementById("recurrence-editor-history");
const recurrenceEditorHistoryListEl = document.getElementById("recurrence-editor-history-list");
const recurrenceDetailModal = document.getElementById("recurrence-detail-modal");
const closeRecurrenceDetailBtn = document.getElementById("close-recurrence-detail");
const recurrenceDetailTitleEl = document.getElementById("recurrence-detail-title");
const recurrenceDetailNextDateEl = document.getElementById("recurrence-detail-next-date");
const recurrenceDetailNextAmountEl = document.getElementById("recurrence-detail-next-amount");
const recurrenceDetailNextMetaEl = document.getElementById("recurrence-detail-next-meta");
const recurrenceDetailListEl = document.getElementById("recurrence-detail-list");
const editRecurrenceFromDetailBtn = document.getElementById("edit-recurrence-from-detail");
let selectedDateISO = "";
let selectedCategoryValue = "";
let selectedAccountId = 0;
let accounts = [];
let selectedAttachmentFile = null;
let categories = [];
let recurrences = [];
let selectedEntryRecurrenceFrequency = "";
let selectedRecurrenceCategoryValue = "";
let selectedRecurrenceAccountId = 0;
let selectedRecurrenceStartDateISO = "";
let selectedRecurrenceFrequencyValue = "monthly";
let savingEntry = false;
let editingEntryId = null;
let editingEntryUserId = 0;
let editingEntryAttachmentPath = "";
let editingEntryDeleted = false;
let editingEntryPending = false;
let editingEntryTypeFallback = "";
let entriesSearchTerm = "";
let searchDebounceTimer = null;
let loadedEntriesIndex = new Map();
let initialBootPending = true;
let entryFilters = { startDate: "", endDate: "", type: "all", categories: [] };
let draftEntryFilters = { startDate: "", endDate: "", type: "all", categories: [] };
let lastScopedEntryFilters = { startDate: "", endDate: "", categories: [] };
const topSummaryState = {
  categorias: { current: [], previous: [] },
  contas: { current: [], previous: [] },
  recorrencias: { current: [] },
};
let selectedUserCategoryIcon = "";
let selectedUserCategoryGlobalId = 0;
let userCategoryIconCatalog = [];
let userCategoryIconCatalogLoaded = false;
let dashboardEntriesCache = [];
let categoryRowsIndex = new Map();
let currentDetailCategoryName = "";
let currentDetailEditableCategoryId = 0;
let currentDetailGlobalCategoryName = "";
let editingUserCategoryId = 0;
let accountRowsIndex = new Map();
let currentDetailAccountId = 0;
let currentDetailAccountName = "";
let selectedUserAccountIcon = "";
let editingUserAccountId = 0;
let confirmActionResolver = null;
let confirmActionConfirmRole = "destructive";
let editingRecurrenceId = 0;
let recurrenceEditorHistoryToken = 0;
let currentProfile = { id: 0, name: "", email: "", role: "", alterdataCode: "", impersonation: { active: false, admin: null } };
let editingAdminCategoryId = 0;
let editingAdminUserId = 0;
let adminUsersCache = [];
let adminCategoriesCache = [];
let adminPendingEntriesCache = [];
let selectedAdminCategoryType = "out";
let selectedAdminUserRole = "user";
let selectedAdminImpersonateUserId = 0;
let selectedAdminCloseMonth = "";
let selectedAdminCloseMonthUserKeys = ["all"];
let selectedAdminExportMonth = "";
let selectedAdminExportType = "all";
let selectedAdminExportUserIds = ["all"];
let adminAlterdataConfigColumns = [];
let adminAlterdataAllowedFields = {};
let editingAdminAlterdataColumn = "";
let selectedAdminAlterdataSourceScope = "entry";
let selectedAdminAlterdataSourceField = "date";
let supportThreadsCache = [];
let selectedSupportThreadId = 0;
let supportMessagesCache = [];
let notificationsCache = [];
let supportAttachmentDraft = null;
let supportEntityPickerType = "";
let supportEntityPickerRows = [];
let supportRecording = null;
let supportRecordingTimer = null;
const ADMIN_ALTERDATA_COLUMNS_META = [
  { column: "A", description: "Código do lançamento automático" },
  { column: "B", description: "Conta débito" },
  { column: "C", description: "Conta crédito" },
  { column: "D", description: "Data" },
  { column: "E", description: "Valor" },
  { column: "F", description: "Código do histórico" },
  { column: "G", description: "Complemento histórico" },
  { column: "H", description: "Centro de custo débito" },
  { column: "I", description: "Centro de custo crédito" },
  { column: "J", description: "Número do documento" },
];
const ADMIN_ALTERDATA_SOURCE_OPTIONS = [
  { value: "entry", label: "Lançamento", icon: "receipt_long" },
  { value: "category", label: "Categoria", icon: "category" },
  { value: "user", label: "Usuário", icon: "person" },
  { value: "fixed", label: "Valor fixo", icon: "tune" },
];
const USER_NOTIFICATIONS_KEY = "caixa_user_notifications";
const AUTH_TOKEN_KEY = "caixa_auth_token";
const IMPERSONATION_ADMIN_TOKEN_KEY = "caixa_impersonation_admin_token";
const ENTRY_RECURRENCE_OPTIONS = [
  { value: "", label: "Nenhuma", icon: "block" },
  { value: "daily", label: "Diária", icon: "today" },
  { value: "weekly", label: "Semanal", icon: "date_range" },
  { value: "biweekly", label: "Quinzenal", icon: "calendar_view_week" },
  { value: "monthly", label: "Mensal", icon: "calendar_month" },
  { value: "annual", label: "Anual", icon: "event_repeat" },
];

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

const moneyNoSymbol = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const CATEGORY_GLYPH = {
  salario: "account_balance_wallet",
  investimento: "trending_up",
  rend: "monitoring",
  aluguel: "home_work",
  cartao: "credit_card",
  servico: "construction",
  dizimo: "volunteer_activism",
  mercado: "shopping_cart",
  restaurante: "restaurant",
  alimentacao: "restaurant",
  casa: "home",
  transporte: "directions_car",
  internet: "wifi",
  saude: "health_and_safety",
  lazer: "movie",
  assinatura: "subscriptions",
  educacao: "school",
  default: "payments",
};

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = false;
  infoEl.hidden = true;
  if (entriesMetaEl && String(entriesMetaEl.textContent || "").trim() === "--") {
    entriesMetaEl.textContent = "Sem dados no per\u00edodo";
  }
}

function getStoredAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function setStoredAuthToken(token) {
  const safeToken = String(token || "").trim();
  try {
    if (safeToken) localStorage.setItem(AUTH_TOKEN_KEY, safeToken);
    else localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
  try {
    if (safeToken) document.cookie = `auth_token=${safeToken}; Path=/; SameSite=Lax`;
    else document.cookie = "auth_token=; Max-Age=0; Path=/; SameSite=Lax";
  } catch {
    // ignore cookie errors
  }
}

function authHeaders(extra = {}, options = {}) {
  const path = String(options?.path || "");
  const preferAdmin = Boolean(options?.preferAdmin) || path.startsWith("/api/admin/");
  const useImpersonationAdminToken = Boolean(
    preferAdmin
    && Boolean(currentProfile?.impersonation?.active)
    && String(currentProfile?.role || "") !== "admin"
  );
  const adminToken = useImpersonationAdminToken ? getImpersonationAdminToken() : "";
  const token = adminToken || getStoredAuthToken();
  const headers = { ...extra };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    headers["X-Auth-Token"] = token;
  }
  return headers;
}

function adminAuthHeaders(extra = {}) {
  return authHeaders(extra, { preferAdmin: true });
}

function getImpersonationAdminToken() {
  try {
    return String(localStorage.getItem(IMPERSONATION_ADMIN_TOKEN_KEY) || "").trim();
  } catch {
    return "";
  }
}

function canApprovePendingEntry() {
  if (String(currentProfile?.role || "") === "admin") return true;
  if (!Boolean(currentProfile?.impersonation?.active)) return false;
  return Boolean(getImpersonationAdminToken());
}

function showInfo(message) {
  infoEl.textContent = message;
  infoEl.hidden = false;
}

async function confirmActionModal({
  header = "Confirmar ação",
  message = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmRole = "destructive",
} = {}) {
  if (!confirmActionModalEl) return false;
  confirmActionConfirmRole = String(confirmRole || "destructive");
  if (confirmActionTitleEl) confirmActionTitleEl.textContent = String(header || "Confirmar ação");
  if (confirmActionMessageEl) confirmActionMessageEl.innerHTML = String(message || "");
  if (cancelConfirmActionBtn) cancelConfirmActionBtn.textContent = String(cancelText || "Cancelar");
  if (confirmConfirmActionBtn) confirmConfirmActionBtn.textContent = String(confirmText || "Confirmar");
  return new Promise(async (resolve) => {
    confirmActionResolver = resolve;
    await confirmActionModalEl.present();
  });
}

async function closeConfirmActionModal(role = "cancel") {
  if (!confirmActionModalEl) return;
  const resolver = confirmActionResolver;
  confirmActionResolver = null;
  try {
    await confirmActionModalEl.dismiss(null, role);
  } catch {
    // no-op
  }
  if (typeof resolver === "function") {
    resolver(role === confirmActionConfirmRole);
  }
}

function setupConfirmActionModal() {
  closeConfirmActionModalBtn?.addEventListener("click", () => {
    void closeConfirmActionModal("cancel");
  });
  cancelConfirmActionBtn?.addEventListener("click", () => {
    void closeConfirmActionModal("cancel");
  });
  confirmConfirmActionBtn?.addEventListener("click", () => {
    void closeConfirmActionModal(confirmActionConfirmRole);
  });
  confirmActionModalEl?.addEventListener("ionModalDidDismiss", (event) => {
    const resolver = confirmActionResolver;
    confirmActionResolver = null;
    if (typeof resolver === "function") {
      const role = String(event?.detail?.role || "cancel");
      resolver(role === confirmActionConfirmRole);
    }
  });
}

function hideMessages() {
  errorEl.hidden = true;
  infoEl.hidden = true;
  errorEl.textContent = "";
  infoEl.textContent = "";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showTab(tabName) {
  const previousActive = tabButtons.find((button) => button.classList.contains("is-active"));
  const transitionToken = ++navTransitionToken;
  const isLancamentos = tabName === "lancamentos";
  const isCategorias = tabName === "categorias";
  const isContas = tabName === "contas";
  const isRecorrencias = tabName === "recorrentes";
  const isAdministracao = tabName === "administracao";
  tabSections.forEach((section) => {
    section.hidden = section.dataset.tabContent !== tabName;
  });
  if (txSearchOverlay) {
    txSearchOverlay.classList.toggle("is-visible", isLancamentos);
    txSearchOverlay.setAttribute("aria-hidden", isLancamentos ? "false" : "true");
  }
  if (catSummaryOverlay) {
    const showSummary = isCategorias || isContas || isRecorrencias;
    catSummaryOverlay.classList.toggle("is-visible", showSummary);
    catSummaryOverlay.setAttribute("aria-hidden", showSummary ? "false" : "true");
  }
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });

  const active = tabButtons.find((button) => button.classList.contains("is-active"));
  triggerTabLiquidFill(previousActive, active, transitionToken);
  if (!isAdministracao) {
    renderTopSummaryForTab(tabName);
  }

  requestAnimationFrame(() => {
    void scrollActiveTabIntoView(transitionToken);
    updateOverlayPositioning();
  });
}

function readCssPx(variableName, fallback = 0) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName);
  const parsed = Number.parseFloat(String(value || "").trim());
  return Number.isFinite(parsed) ? parsed : fallback;
}

function writeCssPx(variableName, value) {
  const px = Math.max(0, Number(value) || 0);
  document.documentElement.style.setProperty(variableName, `${Math.round(px)}px`);
}

function updateOverlayPositioning() {
  if (!dashHeaderEl || !tabNavShell) return;

  const headerRect = dashHeaderEl.getBoundingClientRect();
  const navRect = tabNavShell.getBoundingClientRect();
  if (!headerRect.height || !navRect.height) return;

  const minGap = readCssPx("--overlay-menu-min-gap", 14);
  const navBottomInsideHeader = navRect.bottom - headerRect.top;
  const maxOverlapInsideHeader = Math.max(0, headerRect.height - navBottomInsideHeader - minGap);

  const txSearchCard = txSearchOverlay?.querySelector(".tx-search");
  const catSummaryCard = catSummaryOverlay?.querySelector(".cat-summary");
  const txHeight = txSearchCard?.getBoundingClientRect().height || readCssPx("--tx-search-h", 64);
  const catHeight = catSummaryCard?.getBoundingClientRect().height || readCssPx("--cat-summary-h-current", 132);

  const txDesiredOverlap = txHeight * 0.4;
  const catDesiredOverlap = catHeight * 0.4;
  const txEffectiveOverlap = Math.min(txDesiredOverlap, maxOverlapInsideHeader);
  const catEffectiveOverlap = Math.min(catDesiredOverlap, maxOverlapInsideHeader);

  writeCssPx("--tx-search-h", txHeight);
  writeCssPx("--cat-summary-h-current", catHeight);
  writeCssPx("--tx-search-overlap", txDesiredOverlap);
  writeCssPx("--cat-summary-overlap-current", catDesiredOverlap);
  writeCssPx("--tx-search-overlap-effective", txEffectiveOverlap);
  writeCssPx("--cat-summary-overlap-effective-current", catEffectiveOverlap);
}

function ensureTabFillLayers() {
  return;
}

function syncTabPill() {
  return;
}

function triggerTabLiquidFill(previousActive, active, transitionToken) {
  if (!active || transitionToken !== navTransitionToken) return;

  const prevIndex = previousActive ? tabButtons.indexOf(previousActive) : -1;
  const currIndex = tabButtons.indexOf(active);
  const direction = prevIndex !== -1 ? Math.sign(currIndex - prevIndex) || 1 : 1;
  const liquidClasses = ["liquid-fill-from-left", "liquid-fill-from-right"];

  tabButtons.forEach((button) => {
    liquidClasses.forEach((className) => button.classList.remove(className));
  });

  // Force animation restart reliably on the active tab only.
  if (active) {
    void active.offsetWidth;
  }

  active.classList.add(direction > 0 ? "liquid-fill-from-right" : "liquid-fill-from-left");

  window.setTimeout(() => {
    liquidClasses.forEach((className) => active.classList.remove(className));
  }, 360);
}

let navScrollFrame = null;
let navTransitionToken = 0;
function cancelNavScrollAnimation() {
  if (navScrollFrame !== null) {
    cancelAnimationFrame(navScrollFrame);
    navScrollFrame = null;
  }
}

function animateNavScrollTo(targetLeft, duration = 520, transitionToken = navTransitionToken) {
  if (!tabNavWrap) return Promise.resolve(false);
  if (transitionToken !== navTransitionToken) return Promise.resolve(false);
  const current = tabNavWrap.scrollLeft;
  if (Math.abs(targetLeft - current) < 1) return Promise.resolve(false);
  tabNavWrap.scrollTo({ left: targetLeft, behavior: "smooth" });
  return Promise.resolve(true);
}

function setInitialLoading(active) {
  if (!rootApp) return;
  if (active) {
    if (window.__dashboardLoading && typeof window.__dashboardLoading.begin === "function") {
      window.__dashboardLoading.begin();
    } else {
      rootApp.classList.add("is-booting");
      rootApp.classList.remove("is-boot-exiting");
    }
  } else {
    rootApp.classList.remove("is-boot-exiting");
    rootApp.classList.remove("is-booting");
  }
  if (pageLoadingOverlay) pageLoadingOverlay.setAttribute("aria-hidden", active ? "false" : "true");
}

function scrollActiveTabIntoView(transitionToken = navTransitionToken) {
  if (!tabNavWrap) return Promise.resolve(false);
  if (transitionToken !== navTransitionToken) return Promise.resolve(false);
  const active = tabButtons.find((button) => button.classList.contains("is-active"));
  if (!active) return Promise.resolve(false);
  const navCss = getComputedStyle(tabNavShell || tabNavWrap);
  const leftFade = parseFloat(navCss.getPropertyValue("--tab-fade-left-w")) || 0;
  const rightFade = parseFloat(navCss.getPropertyValue("--tab-fade-right-w")) || 60;
  const fadeInset = parseFloat(navCss.getPropertyValue("--tab-fade-inset")) || 0;
  const safeLeft = parseFloat(navCss.getPropertyValue("--tab-safe-left")) || 8;
  const safeRight = parseFloat(navCss.getPropertyValue("--tab-safe-right")) || 28;
  const leftSafe = fadeInset + leftFade + safeLeft;
  const rightSafe = fadeInset + rightFade + safeRight;
  const currentLeft = tabNavWrap.scrollLeft;
  const viewport = tabNavWrap.clientWidth;
  const currentRight = currentLeft + viewport;
  const itemLeft = active.offsetLeft;
  const itemRight = itemLeft + active.offsetWidth;
  const safeLeftBound = currentLeft + leftSafe;
  const safeRightBound = currentRight - rightSafe;
  const centeredScroll = itemLeft + (active.offsetWidth / 2) - (viewport / 2);

  let targetScroll = centeredScroll;
  if (itemLeft < safeLeftBound) targetScroll = Math.min(targetScroll, itemLeft - leftSafe);
  if (itemRight > safeRightBound) targetScroll = Math.max(targetScroll, itemRight - viewport + rightSafe);

  const maxScroll = Math.max(0, tabNavWrap.scrollWidth - tabNavWrap.clientWidth);
  const clamped = Math.max(0, Math.min(targetScroll, maxScroll));
  if (Math.abs(clamped - currentLeft) > 1) {
    return animateNavScrollTo(clamped, 620, transitionToken);
  }
  return Promise.resolve(false);
}

function setupTabDragScroll() {
  if (!tabNavWrap) return;
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let momentumFrame = null;

  const stopMomentum = () => {
    if (momentumFrame !== null) {
      cancelAnimationFrame(momentumFrame);
      momentumFrame = null;
    }
  };

  const startMomentum = () => {
    stopMomentum();
    const step = () => {
      if (Math.abs(velocity) < 0.08) {
        momentumFrame = null;
        return;
      }
      tabNavWrap.scrollLeft -= velocity * 16;
      velocity *= 0.92;
      momentumFrame = requestAnimationFrame(step);
    };
    momentumFrame = requestAnimationFrame(step);
  };

  tabNavWrap.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    navTransitionToken += 1;
    cancelNavScrollAnimation();
    stopMomentum();
    dragging = true;
    startX = event.clientX;
    startScroll = tabNavWrap.scrollLeft;
    lastX = event.clientX;
    lastT = performance.now();
    velocity = 0;
    tabNavWrap.classList.add("is-dragging");
    tabNavWrap.setPointerCapture(event.pointerId);
  });

  tabNavWrap.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const deltaX = event.clientX - startX;
    tabNavWrap.scrollLeft = startScroll - deltaX;
    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    const dx = event.clientX - lastX;
    velocity = dx / dt;
    lastX = event.clientX;
    lastT = now;
  });

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    tabNavWrap.classList.remove("is-dragging");
    startMomentum();
    if (event && typeof event.pointerId === "number") {
      try {
        tabNavWrap.releasePointerCapture(event.pointerId);
      } catch {
        // ignore capture errors
      }
    }
  };

  tabNavWrap.addEventListener("pointerup", stopDragging);
  tabNavWrap.addEventListener("pointercancel", stopDragging);
  tabNavWrap.addEventListener("lostpointercapture", stopDragging);
  tabNavWrap.addEventListener("scroll", syncTabPill, { passive: true });
}

function setupTabNav() {
  if (!tabButtons.length || !tabSections.length) return;
  ensureTabFillLayers();

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabName = String(button.dataset.tab || "");
      if (!tabName) return;
      showTab(tabName);
    });
  });

  showTab("lancamentos");
  window.addEventListener("resize", syncTabPill, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      requestAnimationFrame(updateOverlayPositioning);
    },
    { passive: true },
  );
  setupTabDragScroll();
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function categoryGlyph(name) {
  const directName = String(name || "").trim();
  if (directName) {
    const categoryMatch = categories.find((item) => String(item?.name || "").trim() === directName);
    const explicitIcon = String(categoryMatch?.icon || "").trim().toLowerCase();
    if (/^[a-z0-9_]{2,64}$/.test(explicitIcon)) {
      return explicitIcon;
    }
  }
  const key = normalizeText(name);
  for (const token of Object.keys(CATEGORY_GLYPH)) {
    if (token !== "default" && key.includes(token)) return CATEGORY_GLYPH[token];
  }
  return CATEGORY_GLYPH.default;
}

function movementGlyph(item) {
  if (item?.type === "out") return "arrow_upward";
  if (item?.type === "in") return "arrow_downward";
  return categoryGlyph(item?.category || item?.description || "");
}

function monthRange() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();
  return `${year}-${month}`;
}

function previousMonthRange(monthKey) {
  const [year, month] = String(monthKey || "").split("-").map((value) => Number(value));
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function periodLabel() {
  const now = new Date();
  return now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatIsoDate(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = String(isoDate).split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
}

function currentMonthBounds() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toIso = (value) => {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  return { start: toIso(start), end: toIso(end) };
}

function initEntryFilters() {
  const bounds = currentMonthBounds();
  entryFilters = { startDate: bounds.start, endDate: bounds.end, type: "all", categories: [] };
  draftEntryFilters = { ...entryFilters, categories: [...entryFilters.categories] };
  lastScopedEntryFilters = { startDate: bounds.start, endDate: bounds.end, categories: [] };
}

function normalizeAppliedEntryFilters() {
  const bounds = currentMonthBounds();
  const allowedTypes = new Set(["all", "in", "out", "pending", "deleted"]);
  const safeType = allowedTypes.has(String(entryFilters?.type || "")) ? String(entryFilters.type) : "all";
  entryFilters.type = safeType;

  if (safeType === "pending" || safeType === "deleted") {
    entryFilters.startDate = "";
    entryFilters.endDate = "";
    entryFilters.categories = [];
    return;
  }

  if (!entryFilters.startDate) entryFilters.startDate = bounds.start;
  if (!entryFilters.endDate) entryFilters.endDate = bounds.end;

  if (!Array.isArray(entryFilters.categories)) {
    entryFilters.categories = [];
  }
  if (!entryFilters.categories.length && categories.length) {
    if (safeType === "in" || safeType === "out") {
      entryFilters.categories = categories
        .filter((item) => String(item?.type || "") === safeType)
        .map((item) => String(item?.name || ""));
    } else {
      entryFilters.categories = categories.map((item) => String(item?.name || ""));
    }
  }
}

function buildEntriesGroupsQueryString(filters, searchTerm) {
  const query = new URLSearchParams();
  if (String(filters?.type || "") === "deleted") {
    query.set("type", "deleted");
    query.set("deleted_only", "1");
    return query.toString();
  }
  if (filters?.startDate) query.set("start", filters.startDate);
  if (filters?.endDate) query.set("end", filters.endDate);
  query.set("type", String(filters?.type || "all"));
  if (String(searchTerm || "").trim()) query.set("q", String(searchTerm || "").trim());
  for (const category of (filters?.categories || [])) {
    query.append("categories[]", category);
  }
  return query.toString();
}

function setEntryDirectionHint(categoryName) {
  const directionEl = document.getElementById("selected-category-direction");
  const categoryValueEl = document.getElementById("selected-category");
  const category = categories.find((item) => String(item?.name || "") === String(categoryName || ""));
  const type = String(category?.type || "");
  if (!directionEl || !type) {
    if (directionEl) directionEl.hidden = true;
    if (categoryValueEl) categoryValueEl.classList.remove("is-in", "is-out");
    return;
  }
  directionEl.hidden = false;
  directionEl.textContent = type === "in" ? "arrow_downward" : "arrow_upward";
  directionEl.classList.remove("is-in", "is-out");
  directionEl.classList.add(type === "in" ? "is-in" : "is-out");
  if (categoryValueEl) {
    categoryValueEl.classList.remove("is-in", "is-out");
    categoryValueEl.classList.add(type === "in" ? "is-in" : "is-out");
  }
}

function entryTypeFromSelectedCategory() {
  const category = categories.find((item) => String(item?.name || "") === String(selectedCategoryValue || ""));
  return String(category?.type || "");
}

function currentEntryTypeForValidation() {
  const fromCategory = entryTypeFromSelectedCategory();
  if (fromCategory === "in" || fromCategory === "out") return fromCategory;
  return String(editingEntryTypeFallback || "");
}

function parseMoneyInput(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits) / 100;
}

function formatMoneyInput(value) {
  return moneyNoSymbol.format(value);
}

function renderAmountInput(rawValue) {
  const numeric = parseMoneyInput(rawValue);
  if (entryAmountInput) {
    entryAmountInput.value = formatMoneyInput(numeric);
  }
  return numeric;
}

function formatAttachmentLabel(name) {
  const text = String(name || "").trim();
  if (!text) return "Toque para anexar foto ou PDF";
  if (text.length <= 34) return text;
  return `${text.slice(0, 16)}...${text.slice(-14)}`;
}

function setPickerExpanded(element, expanded) {
  if (!element) return;
  element.setAttribute("aria-expanded", expanded ? "true" : "false");
}

function setEntryLayerState(open) {
  rootApp?.classList.toggle("is-entry-open", Boolean(open));
}

function refreshPickerLayerState() {
  // no-op: modal separator handled purely by CSS on .sheet-modal::before
}

function setEntryTheme(type) {
  if (!entryModal) return;
  entryModal.classList.remove("entry-theme--in", "entry-theme--out", "entry-theme--neutral");
  if (type === "in") {
    entryModal.classList.add("entry-theme--in");
    return;
  }
  if (type === "out") {
    entryModal.classList.add("entry-theme--out");
    return;
  }
  entryModal.classList.add("entry-theme--neutral");
}

function setSaveButtonVisualState(state = "idle") {
  if (!saveEntryBtn) return;
  const isDisabled = state === "disabled" || state === "saving";
  const adminPendingMode = Boolean(
    editingEntryId
    && editingEntryPending
    && !editingEntryDeleted
    && canApprovePendingEntry()
  );
  saveEntryBtn.disabled = isDisabled;
  saveEntryBtn.classList.toggle("is-disabled", state === "disabled");
  saveEntryBtn.classList.toggle("is-saving", state === "saving");
  if (state === "saving") {
    saveEntryBtn.textContent = adminPendingMode ? "Aprovando..." : "Salvando...";
    return;
  }
  saveEntryBtn.textContent = adminPendingMode ? "APROVAR" : "Salvar";
}

function setEntryModalMode(mode = "create") {
  const isEdit = mode === "edit";
  const isDeleted = mode === "deleted";
  if (entryModalTitleEl) {
    entryModalTitleEl.textContent = isDeleted ? "Lan\u00e7amento exclu\u00eddo" : (isEdit ? "Editar lan\u00e7amento" : "Nova entrada");
  }
  if (deleteEntryBtn) {
    const showDelete = isEdit && !isDeleted;
    deleteEntryBtn.hidden = !showDelete;
    deleteEntryBtn.style.display = showDelete ? "" : "none";
  }
  if (restoreEntryBtn) {
    restoreEntryBtn.hidden = !isDeleted;
    restoreEntryBtn.style.display = isDeleted ? "" : "none";
  }
  if (saveEntryBtn) {
    saveEntryBtn.hidden = isDeleted;
    saveEntryBtn.style.display = isDeleted ? "none" : "";
  }
}

function updateEntryFlowUi() {
  const locked = Boolean(editingEntryDeleted);
  if (openCategoryBtn) openCategoryBtn.disabled = locked;
  if (openAccountBtn) openAccountBtn.disabled = locked;
  if (openDateBtn) openDateBtn.disabled = locked;
  if (openEntryRecurrenceBtn) openEntryRecurrenceBtn.disabled = locked;
  if (openAttachmentBtn) openAttachmentBtn.disabled = locked;
  if (entryDescriptionInput) entryDescriptionInput.disabled = locked;
  if (entryAmountInput) entryAmountInput.disabled = locked;
}

function syncAdminAreaAccess() {
  const isAdmin = String(currentProfile?.role || "") === "admin";
  if (adminMenuBtn) adminMenuBtn.hidden = !isAdmin;
  if (adminTabBtn) adminTabBtn.hidden = !isAdmin;
  if (!isAdmin && activeTabName() === "administracao") {
    showTab("lancamentos");
  }
}

function syncImpersonationBanner() {
  const active = Boolean(currentProfile?.impersonation?.active);
  if (!impersonationBannerEl) return;
  if (!active) {
    impersonationBannerEl.hidden = true;
    return;
  }
  const targetName = String(currentProfile?.name || currentProfile?.email || "Usuário");
  const alterdataCode = String(currentProfile?.alterdataCode || "").trim();
  if (impersonationBannerTextEl) {
    impersonationBannerTextEl.textContent = alterdataCode ? `${targetName} · ${alterdataCode}` : targetName;
  }
  impersonationBannerEl.hidden = false;
}

function syncDashMenuUserSummary() {
  const name = String(currentProfile?.name || currentProfile?.email || "Usuário");
  const email = String(currentProfile?.email || "-");
  const role = adminUserRoleLabel(String(currentProfile?.role || "user"));
  const alterdata = String(currentProfile?.alterdataCode || "").trim();
  const meta = alterdata ? `${role} · Alterdata ${alterdata}` : role;
  if (dashMenuUserNameEl) dashMenuUserNameEl.textContent = name;
  if (dashMenuUserEmailEl) dashMenuUserEmailEl.textContent = email;
  if (dashMenuUserMetaEl) dashMenuUserMetaEl.textContent = meta;
}

function setAttachmentPreview(file) {
  if (!file) {
    if (attachmentPreview) attachmentPreview.hidden = true;
    if (attachmentPreviewImage) {
      attachmentPreviewImage.hidden = true;
      attachmentPreviewImage.removeAttribute("src");
    }
    if (attachmentPreviewPdf) {
      attachmentPreviewPdf.hidden = true;
      attachmentPreviewPdf.removeAttribute("src");
    }
    if (attachmentPreviewName) attachmentPreviewName.textContent = "";
    if (attachmentNameEl) {
      attachmentNameEl.textContent = "Toque para anexar foto ou PDF";
      attachmentNameEl.classList.add("is-placeholder");
    }
    if (attachmentPathEl) attachmentPathEl.textContent = "";
    if (attachmentPathWrapEl) attachmentPathWrapEl.hidden = true;
    return;
  }

  const fileName = String(file.name || "arquivo");
  const type = String(file.type || "").toLowerCase();

  if (attachmentNameEl) {
    attachmentNameEl.textContent = formatAttachmentLabel(fileName);
    attachmentNameEl.classList.remove("is-placeholder");
  }
  if (attachmentPathEl) attachmentPathEl.textContent = "Ser\u00e1 definido ao salvar";
  if (attachmentPathWrapEl) attachmentPathWrapEl.hidden = false;
  if (attachmentPreviewName) attachmentPreviewName.textContent = fileName;
  if (attachmentPreview) attachmentPreview.hidden = false;

  const isPdf = type === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");
  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = String(reader.result || "");
    if (!dataUrl) return;
    if (isPdf) {
      if (attachmentPreviewPdf) {
        attachmentPreviewPdf.src = dataUrl;
        attachmentPreviewPdf.hidden = false;
      }
      if (attachmentPreviewImage) {
        attachmentPreviewImage.hidden = true;
        attachmentPreviewImage.removeAttribute("src");
      }
      return;
    }
    if (attachmentPreviewImage) {
      attachmentPreviewImage.src = dataUrl;
      attachmentPreviewImage.hidden = false;
    }
    if (attachmentPreviewPdf) {
      attachmentPreviewPdf.hidden = true;
      attachmentPreviewPdf.removeAttribute("src");
    }
  };
  reader.onerror = () => {
    clearAttachmentSelection();
    showError("N\u00e3o foi poss\u00edvel carregar a pr\u00e9-visualiza\u00e7\u00e3o do comprovante.");
  };
  reader.readAsDataURL(file);
}

async function closeAttachmentViewer() {
  try {
    await attachmentViewerModal?.dismiss();
  } catch {
    // modal may already be closed
  }
  if (attachmentViewerImage) {
    attachmentViewerImage.hidden = true;
    attachmentViewerImage.removeAttribute("src");
  }
  if (attachmentViewerPdf) {
    attachmentViewerPdf.hidden = true;
    attachmentViewerPdf.removeAttribute("src");
  }
}

async function openAttachmentViewer(source, isPdf = false) {
  const src = String(source || "").trim();
  if (!src) return;
  if (isPdf) {
    if (attachmentViewerPdf) {
      attachmentViewerPdf.src = src;
      attachmentViewerPdf.hidden = false;
    }
    if (attachmentViewerImage) {
      attachmentViewerImage.hidden = true;
      attachmentViewerImage.removeAttribute("src");
    }
  } else {
    if (attachmentViewerImage) {
      attachmentViewerImage.src = src;
      attachmentViewerImage.hidden = false;
    }
    if (attachmentViewerPdf) {
      attachmentViewerPdf.hidden = true;
      attachmentViewerPdf.removeAttribute("src");
    }
  }
  await attachmentViewerModal?.present();
}

function attachmentUrlFromPath(path) {
  const raw = String(path || "").trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("/uploads/")) return raw;
  return `/uploads/${raw.replace(/^\/+/, "")}`;
}

function setAttachmentPreviewFromPath(path) {
  const raw = String(path || "").trim();
  if (!raw) {
    setAttachmentPreview(null);
    return;
  }

  const fileNameRaw = raw.split("/").pop() || "arquivo";
  let fileName = fileNameRaw;
  try {
    fileName = decodeURIComponent(fileNameRaw);
  } catch {
    fileName = fileNameRaw;
  }
  const src = attachmentUrlFromPath(raw);
  const isPdf = raw.toLowerCase().endsWith(".pdf");

  selectedAttachmentFile = null;
  if (attachmentInput) attachmentInput.value = "";
  if (attachmentNameEl) {
    attachmentNameEl.textContent = formatAttachmentLabel(fileName);
    attachmentNameEl.classList.remove("is-placeholder");
  }
  if (attachmentPathEl) attachmentPathEl.textContent = raw;
  if (attachmentPathWrapEl) attachmentPathWrapEl.hidden = false;
  if (attachmentPreviewName) attachmentPreviewName.textContent = fileName;
  if (attachmentPreview) attachmentPreview.hidden = false;

  if (isPdf) {
    if (attachmentPreviewPdf) {
      attachmentPreviewPdf.src = src;
      attachmentPreviewPdf.hidden = false;
    }
    if (attachmentPreviewImage) {
      attachmentPreviewImage.hidden = true;
      attachmentPreviewImage.removeAttribute("src");
    }
    return;
  }

  if (attachmentPreviewImage) {
    attachmentPreviewImage.src = src;
    attachmentPreviewImage.hidden = false;
  }
  if (attachmentPreviewPdf) {
    attachmentPreviewPdf.hidden = true;
    attachmentPreviewPdf.removeAttribute("src");
  }
}

function clearAttachmentSelection(clearStoredPath = false) {
  selectedAttachmentFile = null;
  if (attachmentInput) attachmentInput.value = "";
  if (clearStoredPath) editingEntryAttachmentPath = "";
  setAttachmentPreview(null);
}

async function openCategorySheet() {
  await closeDateSheet();
  await closeAccountSheet();
  await closeEntryRecurrenceSheet();
  await categoryModal?.present();
  setPickerExpanded(openCategoryBtn, true);
  refreshPickerLayerState();
  setTimeout(() => {
    categorySearchInput?.setFocus?.();
  }, 30);
}

async function closeCategorySheet() {
  try {
    await categoryModal?.dismiss();
  } catch {
    // no-op: modal may already be closed
  }
  setPickerExpanded(openCategoryBtn, false);
  refreshPickerLayerState();
}

function activeTabName() {
  const active = tabButtons.find((button) => button.classList.contains("is-active"));
  return String(active?.dataset?.tab || "lancamentos");
}

function setTopSummaryLabels(left, right) {
  if (catSoFarLabelEl) catSoFarLabelEl.textContent = String(left || "");
  if (catLastMonthLabelEl) catLastMonthLabelEl.textContent = String(right || "");
}

function setTopSummaryExtra(text = "") {
  if (!catSummaryExtraEl) return;
  const value = String(text || "").trim();
  catSummaryExtraEl.hidden = value.length === 0;
  catSummaryExtraEl.textContent = value;
}

function setTopSummaryExtraValue(text = "", tone = "") {
  if (!catSummaryExtraValueEl) return;
  const value = String(text || "").trim();
  const classTone = String(tone || "").trim();
  catSummaryExtraValueEl.hidden = value.length === 0;
  catSummaryExtraValueEl.textContent = value;
  catSummaryExtraValueEl.classList.remove("pos", "neg");
  if (classTone === "pos" || classTone === "neg") {
    catSummaryExtraValueEl.classList.add(classTone);
  }
}

function renderRecurrenceTopSummary(items) {
  const rows = Array.isArray(items) ? items : [];
  const activeRows = rows.filter((item) => Number(item?.active ?? 1) === 1);
  const total = activeRows.length;
  const nextRecurrence = activeRows
    .sort((a, b) => String(a?.next_run_date || "").localeCompare(String(b?.next_run_date || "")))[0];

  setTopSummaryLabels("recorrências ativas", "próxima data");
  catSummaryCardEl?.classList.add("cat-summary--recurrences");

  if (catSoFarEl) {
    catSoFarEl.textContent = String(total);
    catSoFarEl.classList.remove("pos", "neg");
  }
  if (catLastMonthEl) {
    catLastMonthEl.textContent = nextRecurrence ? formatIsoDate(String(nextRecurrence?.next_run_date || "")) : "--";
    catLastMonthEl.classList.remove("pos", "neg");
  }
  if (!nextRecurrence) {
    setTopSummaryExtra("Nenhuma recorrência agendada no momento.");
    setTopSummaryExtraValue("");
  } else {
    const category = String(nextRecurrence?.category || "Recorrência");
    const frequency = recurrenceFrequencyLabel(nextRecurrence?.frequency);
    const account = String(nextRecurrence?.account_name || "Sem conta/cartão");
    const amountRaw = Number(nextRecurrence?.amount || 0);
    const signedAmount = String(nextRecurrence?.type || "") === "out" ? -Math.abs(amountRaw) : Math.abs(amountRaw);
    const amountClass = toAmountClass(signedAmount);
    setTopSummaryExtra(`${category} · ${frequency} · ${account}`);
    setTopSummaryExtraValue(money.format(signedAmount), amountClass);
  }
}

function renderTopSummaryForTab(tabName) {
  const currentTab = String(tabName || activeTabName());
  if (currentTab === "categorias") {
    catSummaryCardEl?.classList.remove("cat-summary--recurrences");
    setTopSummaryLabels("saldo no mês", "mês anterior");
    setTopSummaryExtra("");
    setTopSummaryExtraValue("");
    const state = topSummaryState.categorias || { current: [], previous: [] };
    updateTopSummaryPanel(
      state.current,
      state.previous,
      categoryBalance,
      (item) => String(item?.name || ""),
    );
    return;
  }
  if (currentTab === "contas") {
    catSummaryCardEl?.classList.remove("cat-summary--recurrences");
    setTopSummaryLabels("saldo no mês", "mês anterior");
    setTopSummaryExtra("");
    setTopSummaryExtraValue("");
    const state = topSummaryState.contas || { current: [], previous: [] };
    updateTopSummaryPanel(
      state.current,
      state.previous,
      (item) => Number(item?.balance || 0),
      (item) => String(item?.name || ""),
    );
    return;
  }
  if (currentTab === "recorrentes") {
    const state = topSummaryState.recorrencias || { current: [] };
    renderRecurrenceTopSummary(state.current);
  }
}

async function openAccountSheet() {
  await closeDateSheet();
  await closeCategorySheet();
  await closeEntryRecurrenceSheet();
  await accountModal?.present();
  setPickerExpanded(openAccountBtn, true);
  refreshPickerLayerState();
  setTimeout(() => {
    accountSearchInput?.setFocus?.();
  }, 30);
}

async function closeAccountSheet() {
  try {
    await accountModal?.dismiss();
  } catch {
    // no-op: modal may already be closed
  }
  setPickerExpanded(openAccountBtn, false);
  refreshPickerLayerState();
}

async function openDateSheet() {
  await closeCategorySheet();
  await closeAccountSheet();
  await closeEntryRecurrenceSheet();
  await dateModal?.present();
  setPickerExpanded(openDateBtn, true);
  refreshPickerLayerState();
}

async function closeDateSheet() {
  try {
    await dateModal?.dismiss();
  } catch {
    // no-op: modal may already be closed
  }
  setPickerExpanded(openDateBtn, false);
  refreshPickerLayerState();
}

function entryRecurrenceLabel(value) {
  const key = String(value || "").trim().toLowerCase();
  const option = ENTRY_RECURRENCE_OPTIONS.find((item) => item.value === key);
  return option ? option.label : "Nenhuma";
}

function syncEntryRecurrenceSelection() {
  if (!selectedEntryRecurrenceEl) return;
  selectedEntryRecurrenceEl.textContent = entryRecurrenceLabel(selectedEntryRecurrenceFrequency);
  selectedEntryRecurrenceEl.classList.toggle("is-placeholder", !selectedEntryRecurrenceFrequency);
}

function renderEntryRecurrenceOptions() {
  if (!entryRecurrenceListEl) return;
  entryRecurrenceListEl.innerHTML = ENTRY_RECURRENCE_OPTIONS.map((item) => {
    const isSelected = selectedEntryRecurrenceFrequency === item.value;
    return `
      <button type="button" class="category-option is-neutral" data-entry-recurrence="${encodeURIComponent(item.value)}"${isSelected ? ' aria-current="true"' : ""}>
        <span class="category-option__lead"><span class="material-symbols-rounded">${item.icon}</span></span>
        <span class="category-option__text">${escapeHtml(item.label)}</span>
      </button>
    `;
  }).join("");
}

async function openEntryRecurrenceSheet() {
  await closeCategorySheet();
  await closeAccountSheet();
  await closeDateSheet();
  renderEntryRecurrenceOptions();
  await entryRecurrenceModal?.present();
  setPickerExpanded(openEntryRecurrenceBtn, true);
  refreshPickerLayerState();
}

async function closeEntryRecurrenceSheet() {
  try {
    await entryRecurrenceModal?.dismiss();
  } catch {
    // no-op
  }
  setPickerExpanded(openEntryRecurrenceBtn, false);
  refreshPickerLayerState();
}

function isEntryFormValid() {
  if (editingEntryDeleted) return false;
  const type = currentEntryTypeForValidation();
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const accountId = Number(selectedAccountId || 0);
  const date = String(selectedDateISO || "").slice(0, 10).trim();
  return ["in", "out"].includes(type)
    && Number.isFinite(amount)
    && amount > 0
    && category.length > 0
    && accountId > 0
    && /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function hasEntryMinimumRequiredData() {
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const accountId = Number(selectedAccountId || 0);
  return Number.isFinite(amount) && amount > 0 && category.length > 0 && accountId > 0;
}

function updateSaveState() {
  updateEntryFlowUi();
  if (savingEntry) {
    setSaveButtonVisualState("saving");
    return;
  }
  if (editingEntryId && editingEntryPending && !editingEntryDeleted && canApprovePendingEntry()) {
    setSaveButtonVisualState(isEntryFormValid() ? "idle" : "disabled");
    return;
  }
  if (!hasEntryMinimumRequiredData()) {
    setSaveButtonVisualState("disabled");
    return;
  }
  setSaveButtonVisualState(isEntryFormValid() ? "idle" : "disabled");
}

function renderCategoryOptions(type = "") {
  if (!categoryListEl) return;
  const selectedType = String(type || "");
  const filtered = categories.filter((category) => {
    const categoryType = String(category?.type || "").trim();
    return !selectedType || !categoryType || categoryType === selectedType;
  });
  const query = String(categorySearchInput?.value || "").trim().toLowerCase();
  const searched = filtered.filter((category) =>
    String(category?.name || "").toLowerCase().includes(query)
  );

  if (!searched.length) {
    categoryListEl.innerHTML = `<p class="category-empty">Nenhuma categoria encontrada.</p>`;
    return;
  }
  const groups = [
    { key: "in", title: "Entrada", icon: "arrow_downward" },
    { key: "out", title: "Sa\u00edda", icon: "arrow_upward" },
  ];

  const html = groups
    .map((group) => {
      const options = searched.filter((category) => String(category?.type || "") === group.key);
      if (!options.length) return "";
      const optionsHtml = options
        .map((category) => {
          const label = String(category?.name || "").trim();
          const safeLabel = escapeHtml(label);
          const encodedLabel = encodeURIComponent(label);
          const isSelected = selectedCategoryValue === label;
          return `
            <button type="button" class="category-option is-${group.key}" data-category="${encodedLabel}"${isSelected ? ' aria-current="true"' : ""}>
              <span class="category-option__lead"><span class="material-symbols-rounded">${group.icon}</span></span>
              <span class="category-option__text">${safeLabel}</span>
            </button>
          `;
        })
        .join("");
      return `
        <section class="category-group">
          <h4 class="category-group__title">${group.title}</h4>
          <div class="category-group__items">${optionsHtml}</div>
        </section>
      `;
    })
    .join("");

  categoryListEl.innerHTML = html || `<p class="category-empty">Nenhuma categoria encontrada.</p>`;
}

function accountTypeLabel(value) {
  return String(value || "") === "card" ? "Cartões" : "Contas";
}

function accountTypeIcon(value) {
  return String(value || "") === "card" ? "credit_card" : "account_balance";
}

function renderAccountOptions() {
  if (!accountListEl) return;
  const query = String(accountSearchInput?.value || "").trim().toLowerCase();
  const searched = accounts.filter((account) =>
    String(account?.name || "").toLowerCase().includes(query)
  );

  if (!searched.length) {
    accountListEl.innerHTML = `<p class="category-empty">Nenhuma conta/cartão encontrada.</p>`;
    return;
  }

  const groups = [
    { key: "bank" },
    { key: "card" },
  ];

  const html = groups
    .map((group) => {
      const options = searched.filter((account) => String(account?.type || "bank") === group.key);
      if (!options.length) return "";
      const optionsHtml = options
        .map((account) => {
          const id = Number(account?.id || 0);
          const label = String(account?.name || "").trim();
          const isSelected = selectedAccountId === id;
          return `
            <button type="button" class="category-option is-neutral" data-account-id="${id}"${isSelected ? ' aria-current="true"' : ""}>
              <span class="category-option__lead"><span class="material-symbols-rounded">${accountTypeIcon(group.key)}</span></span>
              <span class="category-option__text">${escapeHtml(label)}</span>
            </button>
          `;
        })
        .join("");
      return `
        <section class="category-group">
          <h4 class="category-group__title">${accountTypeLabel(group.key)}</h4>
          <div class="category-group__items">${optionsHtml}</div>
        </section>
      `;
    })
    .join("");

  accountListEl.innerHTML = html || `<p class="category-empty">Nenhuma conta/cartão encontrada.</p>`;
}

async function loadAccounts(includeInactive = false) {
  try {
    const url = includeInactive ? "/api/accounts?include_inactive=1" : "/api/accounts";
    const response = await authFetch(url);
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!response.ok) {
      accounts = [];
      renderAccountOptions();
      return;
    }
    const data = await response.json();
    accounts = Array.isArray(data) ? data : [];
    renderAccountOptions();
    syncRecurrencePickers();
  } catch {
    accounts = [];
    renderAccountOptions();
    syncRecurrencePickers();
  }
}

function globalCategoriesOnly() {
  return categories.filter((item) => String(item?.scope || "global") === "global");
}

function syncUserCategorySelections() {
  const globals = globalCategoriesOnly();
  if (!globals.length) {
    selectedUserCategoryGlobalId = 0;
  } else if (!globals.some((item) => Number(item?.id || 0) === selectedUserCategoryGlobalId)) {
    selectedUserCategoryGlobalId = Number(globals[0]?.id || 0);
  }

  if (selectedUserCategoryIconGlyphEl) {
    if (selectedUserCategoryIcon) {
      selectedUserCategoryIconGlyphEl.textContent = selectedUserCategoryIcon;
      selectedUserCategoryIconGlyphEl.hidden = false;
    } else {
      selectedUserCategoryIconGlyphEl.textContent = "label";
      selectedUserCategoryIconGlyphEl.hidden = true;
    }
  }
  if (selectedUserCategoryIconTextEl) {
    if (selectedUserCategoryIcon) {
      selectedUserCategoryIconTextEl.textContent = "Ícone selecionado";
      selectedUserCategoryIconTextEl.classList.remove("is-placeholder");
    } else {
      selectedUserCategoryIconTextEl.textContent = "Selecione um ícone";
      selectedUserCategoryIconTextEl.classList.add("is-placeholder");
    }
  }

  if (selectedUserCategoryGlobalEl) {
    const selected = globals.find((item) => Number(item?.id || 0) === selectedUserCategoryGlobalId);
    if (selected) {
      selectedUserCategoryGlobalEl.textContent = String(selected?.name || "");
      selectedUserCategoryGlobalEl.classList.remove("is-placeholder");
    } else {
      selectedUserCategoryGlobalEl.textContent = "Selecionar categoria global";
      selectedUserCategoryGlobalEl.classList.add("is-placeholder");
    }
  }
  updateUserCategorySaveState();
}

function updateUserCategorySaveState() {
  if (!saveUserCategoryBtn) return;
  const name = String(userCategoryNameInput?.value || "").trim();
  saveUserCategoryBtn.disabled = !(name && selectedUserCategoryGlobalId > 0 && selectedUserCategoryIcon);
}

async function ensureUserCategoryIconCatalogLoaded() {
  if (userCategoryIconCatalogLoaded) return;
  const fallback = Object.values(CATEGORY_GLYPH).filter((value, idx, arr) => value && arr.indexOf(value) === idx);
  try {
    const response = await fetch("/assets/data/material-symbols-rounded.json", {
      method: "GET",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.ok) {
      const payload = await safeJson(response, []);
      const normalized = Array.isArray(payload)
        ? payload
            .map((item) => String(item || "").trim())
            .filter((item, idx, arr) => item && arr.indexOf(item) === idx)
        : [];
      userCategoryIconCatalog = normalized.length ? normalized : fallback;
    } else {
      userCategoryIconCatalog = fallback;
    }
  } catch {
    userCategoryIconCatalog = fallback;
  } finally {
    userCategoryIconCatalogLoaded = true;
  }
}

function renderUserCategoryIconOptions() {
  if (!userCategoryIconListEl) return;
  userCategoryIconListEl.classList.add("icon-grid-list");
  const source = userCategoryIconCatalog.length ? userCategoryIconCatalog : ["label"];
  const filtered = source.slice(0, 600);
  if (!filtered.length) {
    userCategoryIconListEl.innerHTML = `<p class="category-empty">Nenhum ícone encontrado.</p>`;
    return;
  }
  userCategoryIconListEl.innerHTML = filtered
    .map((iconName) => {
      const safe = escapeHtml(iconName);
      const encoded = encodeURIComponent(iconName);
      const isSelected = selectedUserCategoryIcon === iconName;
      return `
        <button type="button" class="icon-grid-option" data-user-category-icon="${encoded}" aria-label="${safe}" title="${safe}"${isSelected ? ' aria-current="true"' : ""}>
          <span class="material-symbols-rounded">${safe}</span>
        </button>
      `;
    })
    .join("");
}

function renderUserCategoryGlobalOptions() {
  if (!userCategoryGlobalListEl) return;
  userCategoryGlobalListEl.classList.remove("icon-grid-list");
  const query = normalizeText(userCategoryGlobalSearchInput?.value || "");
  const globals = globalCategoriesOnly().filter((item) =>
    normalizeText(item?.name || "").includes(query)
  );
  if (!globals.length) {
    userCategoryGlobalListEl.innerHTML = `<p class="category-empty">Nenhuma categoria global encontrada.</p>`;
    return;
  }
  const groups = [
    { key: "in", title: "Entrada", icon: "arrow_downward" },
    { key: "out", title: "Saída", icon: "arrow_upward" },
  ];
  const html = groups
    .map((group) => {
      const options = globals.filter((item) => String(item?.type || "") === group.key);
      if (!options.length) return "";
      const optionsHtml = options
        .map((category) => {
          const id = Number(category?.id || 0);
          const label = String(category?.name || "").trim();
          const safeLabel = escapeHtml(label);
          const isSelected = selectedUserCategoryGlobalId === id;
          return `
            <button type="button" class="category-option is-${group.key}" data-user-category-global="${id}"${isSelected ? ' aria-current="true"' : ""}>
              <span class="category-option__lead"><span class="material-symbols-rounded">${group.icon}</span></span>
              <span class="category-option__text">${safeLabel}</span>
            </button>
          `;
        })
        .join("");
      return `
        <section class="category-group">
          <h4 class="category-group__title">${group.title}</h4>
          <div class="category-group__items">${optionsHtml}</div>
        </section>
      `;
    })
    .join("");

  userCategoryGlobalListEl.innerHTML = html || `<p class="category-empty">Nenhuma categoria global encontrada.</p>`;
}

async function openUserCategoryModal() {
  if (!userCategoryModal) return;
  editingUserCategoryId = 0;
  if (userCategoryModalTitleEl) userCategoryModalTitleEl.textContent = "Nova categoria";
  if (userCategoryNameInput) userCategoryNameInput.value = "";
  if (userCategoryGlobalSearchInput) userCategoryGlobalSearchInput.value = "";
  selectedUserCategoryIcon = "";
  syncUserCategorySelections();
  await userCategoryModal.present();
}

async function openUserCategoryEditModal(category) {
  if (!userCategoryModal) return;
  editingUserCategoryId = Number(category?.id || 0);
  if (userCategoryModalTitleEl) userCategoryModalTitleEl.textContent = "Editar categoria";
  if (userCategoryNameInput) userCategoryNameInput.value = String(category?.name || "");
  if (userCategoryGlobalSearchInput) userCategoryGlobalSearchInput.value = "";
  selectedUserCategoryIcon = String(category?.icon || "").trim();
  selectedUserCategoryGlobalId = Number(category?.global_category_id || 0);
  syncUserCategorySelections();
  await userCategoryModal.present();
}

async function closeUserCategoryModal() {
  await userCategoryModal?.dismiss();
}

async function openUserCategoryIconModal() {
  if (!userCategoryIconModal) return;
  await ensureUserCategoryIconCatalogLoaded();
  renderUserCategoryIconOptions();
  await userCategoryIconModal.present();
}

async function closeUserCategoryIconModal() {
  await userCategoryIconModal?.dismiss();
}

async function openUserCategoryGlobalModal() {
  if (!userCategoryGlobalModal) return;
  renderUserCategoryGlobalOptions();
  await userCategoryGlobalModal.present();
}

async function closeUserCategoryGlobalModal() {
  await userCategoryGlobalModal?.dismiss();
}

async function createUserCategory() {
  const name = String(userCategoryNameInput?.value || "").trim();
  const icon = String(selectedUserCategoryIcon || "").trim();
  const globalCategoryId = Number(selectedUserCategoryGlobalId || 0);
  if (!name || globalCategoryId <= 0 || !String(selectedUserCategoryIcon || "").trim()) {
    showError("Preencha nome, ícone e categoria global.");
    return;
  }

  if (saveUserCategoryBtn) saveUserCategoryBtn.disabled = true;
  try {
    const endpoint = editingUserCategoryId > 0 ? `/api/user-categories/${editingUserCategoryId}` : "/api/user-categories";
    const response = await fetch(endpoint, {
      method: editingUserCategoryId > 0 ? "PUT" : "POST",
      credentials: "same-origin",
      headers: authHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        name,
        icon,
        global_category_id: globalCategoryId,
      }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || (editingUserCategoryId > 0 ? "Não foi possível atualizar categoria." : "Não foi possível criar categoria.")));
      return;
    }
    await closeUserCategoryModal();
    await loadCategories();
    selectedCategoryValue = String(payload?.name || name);
    if (selectedCategoryEl) {
      selectedCategoryEl.textContent = selectedCategoryValue;
      selectedCategoryEl.classList.remove("is-placeholder");
    }
    setEntryDirectionHint(selectedCategoryValue);
    setEntryTheme(entryTypeFromSelectedCategory() || "neutral");
    updateSaveState();
    showInfo(editingUserCategoryId > 0 ? "Categoria atualizada com sucesso." : "Categoria criada com sucesso.");
  } catch {
    showError(editingUserCategoryId > 0 ? "Falha de rede ao atualizar categoria." : "Falha de rede ao criar categoria.");
  } finally {
    if (saveUserCategoryBtn) saveUserCategoryBtn.disabled = false;
  }
}

function syncUserAccountSelections() {
  if (selectedUserAccountIconGlyphEl) {
    if (selectedUserAccountIcon) {
      selectedUserAccountIconGlyphEl.textContent = selectedUserAccountIcon;
      selectedUserAccountIconGlyphEl.hidden = false;
    } else {
      selectedUserAccountIconGlyphEl.textContent = "account_balance_wallet";
      selectedUserAccountIconGlyphEl.hidden = true;
    }
  }
  if (selectedUserAccountIconTextEl) {
    if (selectedUserAccountIcon) {
      selectedUserAccountIconTextEl.textContent = "Ícone selecionado";
      selectedUserAccountIconTextEl.classList.remove("is-placeholder");
    } else {
      selectedUserAccountIconTextEl.textContent = "Selecione um ícone";
      selectedUserAccountIconTextEl.classList.add("is-placeholder");
    }
  }
  updateUserAccountSaveState();
}

function updateUserAccountSaveState() {
  const hasName = String(userAccountNameInput?.value || "").trim().length > 0;
  const hasIcon = String(selectedUserAccountIcon || "").trim().length > 0;
  if (saveUserAccountBtn) {
    saveUserAccountBtn.disabled = !(hasName && hasIcon);
  }
}

function resetUserAccountModal() {
  editingUserAccountId = 0;
  if (userAccountModalTitleEl) userAccountModalTitleEl.textContent = "Nova conta/cartão";
  if (userAccountNameInput) userAccountNameInput.value = "";
  if (userAccountInitialBalanceInput) userAccountInitialBalanceInput.value = formatMoneyInput(0);
  if (userAccountTypeInput) userAccountTypeInput.value = "bank";
  selectedUserAccountIcon = "";
  syncUserAccountSelections();
}

async function openUserAccountModal() {
  resetUserAccountModal();
  await ensureUserCategoryIconCatalogLoaded();
  renderUserAccountIconOptions();
  await userAccountModal?.present();
}

async function openUserAccountEditModal(account) {
  editingUserAccountId = Number(account?.id || 0);
  if (editingUserAccountId <= 0) {
    showError("Conta/cartão inválido para edição.");
    return;
  }
  if (userAccountModalTitleEl) userAccountModalTitleEl.textContent = "Editar conta/cartão";
  if (userAccountNameInput) userAccountNameInput.value = String(account?.name || "");
  if (userAccountInitialBalanceInput) userAccountInitialBalanceInput.value = formatMoneyInput(Number(account?.initial_balance || 0));
  if (userAccountTypeInput) userAccountTypeInput.value = String(account?.type || "bank");
  selectedUserAccountIcon = String(account?.icon || "account_balance_wallet");
  syncUserAccountSelections();
  await ensureUserCategoryIconCatalogLoaded();
  renderUserAccountIconOptions();
  await userAccountModal?.present();
}

async function closeUserAccountModal() {
  await userAccountModal?.dismiss();
  resetUserAccountModal();
}

function renderUserAccountIconOptions() {
  if (!userAccountIconListEl) return;
  userAccountIconListEl.classList.add("icon-grid-list");
  const preferred = [
    "account_balance_wallet",
    "account_balance",
    "credit_card",
    "wallet",
    "savings",
    "payments",
    "paid",
    "attach_money",
    "currency_exchange",
    "receipt_long",
    "point_of_sale",
    "storefront",
    "shopping_cart",
    "local_atm",
    "calculate",
  ];
  const base = userCategoryIconCatalog.length
    ? userCategoryIconCatalog
    : preferred;
  const preferredAvailable = preferred.filter((icon) => base.includes(icon));
  const remaining = base.filter((icon) => !preferredAvailable.includes(icon));
  const ordered = [...preferredAvailable, ...remaining];
  const withSelected = selectedUserAccountIcon && !ordered.includes(selectedUserAccountIcon)
    ? [selectedUserAccountIcon, ...ordered]
    : ordered;
  const items = withSelected.slice(0, 600);
  userAccountIconListEl.innerHTML = items
    .map((iconName) => {
      const safe = escapeHtml(iconName);
      const encoded = encodeURIComponent(iconName);
      const isSelected = selectedUserAccountIcon === iconName;
      return `
        <button type="button" class="icon-grid-option" data-user-account-icon="${encoded}" aria-label="${safe}" title="${safe}"${isSelected ? ' aria-current="true"' : ""}>
          <span class="material-symbols-rounded">${safe}</span>
        </button>
      `;
    })
    .join("");
}

async function openUserAccountIconModal() {
  if (!userAccountIconModal) return;
  await ensureUserCategoryIconCatalogLoaded();
  renderUserAccountIconOptions();
  await userAccountIconModal.present();
}

async function closeUserAccountIconModal() {
  await userAccountIconModal?.dismiss();
}

async function saveUserAccount() {
  const name = String(userAccountNameInput?.value || "").trim();
  const icon = String(selectedUserAccountIcon || "").trim();
  const type = String(userAccountTypeInput?.value || "bank").trim();
  const initialBalance = parseMoneyInput(userAccountInitialBalanceInput?.value || "");
  if (!name || !icon || !["bank", "card"].includes(type)) {
    showError("Preencha nome, tipo e ícone da conta/cartão.");
    return;
  }
  if (!Number.isFinite(initialBalance)) {
    showError("Saldo inicial inválido.");
    return;
  }
  if (saveUserAccountBtn) saveUserAccountBtn.disabled = true;
  try {
    const endpoint = editingUserAccountId > 0 ? `/api/accounts/${editingUserAccountId}` : "/api/accounts";
    const response = await fetch(endpoint, {
      method: editingUserAccountId > 0 ? "PUT" : "POST",
      credentials: "same-origin",
      headers: authHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ name, type, icon, initial_balance: initialBalance }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || (editingUserAccountId > 0 ? "Não foi possível atualizar conta/cartão." : "Não foi possível criar conta/cartão.")));
      return;
    }
    await closeUserAccountModal();
    await loadAccounts(true);
    await loadDashboard();
    showInfo(editingUserAccountId > 0 ? "Conta/cartão atualizado com sucesso." : "Conta/cartão criado com sucesso.");
  } catch {
    showError(editingUserAccountId > 0 ? "Falha de rede ao atualizar conta/cartão." : "Falha de rede ao criar conta/cartão.");
  } finally {
    if (saveUserAccountBtn) saveUserAccountBtn.disabled = false;
  }
}

function toAmountClass(value) {
  if (value < 0) return "neg";
  if (value > 0) return "pos";
  return "";
}

function polylinePoints(series) {
  if (!Array.isArray(series) || series.length === 0) return "0,44 200,44";
  const values = series.map((point) => Number(point.month_balance || 0));
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 200;
      const y = 54 - ((value - min) / span) * 40;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function asDateLabel(isoDate) {
  if (!isoDate) return "Sem data";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return date.toLocaleDateString("pt-BR");
}

function rowTemplate(item, mode) {
  const amount = Number(item.amount || 0);
  const signed = item.type === "out" ? -Math.abs(amount) : Math.abs(amount);
  const amountClass = toAmountClass(signed);
  const title = escapeHtml(item.description || item.category || "Movimento");
  const category = escapeHtml(item.category || "Sem categoria");
  if (mode === "entry") {
    const chipTone = item.type === "in" ? "entry-chip--in" : "entry-chip--out";
    const isPending = Number(item?.needs_review || 0) === 1 || String(item?.status || "") === "pending";
    const pendingChip = isPending ? '<span class="entry-chip entry-chip--pending">Pendente</span>' : "";
    const entryId = Number(item.id || 0);
    return `
      <button type="button" class="entry-row entry-row--button" data-entry-id="${entryId}" aria-label="Editar lan\u00e7amento ${title}">
        <div class="entry-row__title">${title}</div>
        <div class="entry-row__chips">
          <span class="entry-chip ${chipTone}">${category}</span>
          ${pendingChip}
        </div>
        <div class="entry-row__value ${amountClass}">${money.format(signed)}</div>
      </button>
    `;
  }

  const subtitle = mode === "next" ? `Vence em ${asDateLabel(item.date)}` : category;
  return `
    <div class="row">
      <div class="icon-circle"><span class="material-symbols-rounded">${categoryGlyph(item.category || item.description || "")}</span></div>
      <div>
        <div class="row-title">${title}</div>
        <div class="row-meta">${subtitle}</div>
      </div>
      <div class="row-value ${amountClass}">${money.format(signed)}</div>
    </div>
  `;
}

function renderEntriesEmptyState(container, message = "Nenhum lan\u00e7amento no per\u00edodo.") {
  container.innerHTML = `
    <div class="tx-empty-state" role="status" aria-live="polite">
      <p class="tx-empty-state__title">Nenhum lan\u00e7amento</p>
      <p class="tx-empty-state__text">${escapeHtml(message)}</p>
    </div>
  `;
}

function renderEntriesGroupedFromServer(container, groups, emptyText) {
  if (!Array.isArray(groups) || groups.length === 0) {
    renderEntriesEmptyState(container, emptyText || "Nenhum lan\u00e7amento encontrado.");
    return;
  }

  loadedEntriesIndex = new Map();
  container.innerHTML = groups
    .map((yearNode) => {
      const yearBalance = Number(yearNode?.totals?.balance || 0);
      const yearClass = toAmountClass(yearBalance);
      const months = (Array.isArray(yearNode?.months) ? yearNode.months : [])
        .map((monthNode) => {
          const monthBalance = Number(monthNode?.totals?.balance || 0);
          const monthClass = toAmountClass(monthBalance);
          const days = (Array.isArray(monthNode?.days) ? monthNode.days : [])
            .map((dayNode) => {
              const dayBalanceValue = Number(dayNode?.totals?.balance || 0);
              const dayClass = toAmountClass(dayBalanceValue);
              const rows = (Array.isArray(dayNode?.entries) ? dayNode.entries : [])
                .map((item) => {
                  const id = Number(item?.id || 0);
                  if (id > 0) loadedEntriesIndex.set(id, item);
                  return rowTemplate(item, "entry");
                })
                .join("");
              return `
                <section class="entry-day">
                  <header class="entry-day__head">
                    <div class="entry-group entry-group--day">${escapeHtml(dayGroupLabel(dayNode))}</div>
                    <div class="entry-day__value ${dayClass}">${money.format(dayBalanceValue)}</div>
                  </header>
                  <div class="entry-cluster__rows">${rows}</div>
                </section>
              `;
            })
            .join("");
          return `
            <section class="entry-month">
              <header class="entry-month__head">
                <div class="entry-month__title">${escapeHtml(monthLabelWithoutYear(String(monthNode?.label || monthNode?.month || ""), String(monthNode?.month || "")))}</div>
                <div class="entry-month__value ${monthClass}">${money.format(monthBalance)}</div>
              </header>
              ${days}
            </section>
          `;
        })
        .join("");
      return `
        <section class="entry-year">
          <header class="entry-year__head">
            <div class="entry-group entry-group--year">${escapeHtml(String(yearNode?.label || yearNode?.year || ""))}</div>
            <div class="entry-year__value ${yearClass}">${money.format(yearBalance)}</div>
          </header>
          ${months}
        </section>
      `;
    })
    .join("");
}

function formatFilterPanel() {
  if (!filterPanelPeriod) return;
  if (entryFilters.type === "pending") {
    filterPanelPeriod.textContent = "Pendentes (todos)";
    return;
  }
  if (entryFilters.type === "deleted") {
    filterPanelPeriod.textContent = "Exclu\u00eddos (todos)";
    return;
  }
  const start = formatIsoDate(entryFilters.startDate);
  const end = formatIsoDate(entryFilters.endDate);
  filterPanelPeriod.textContent = start && end ? `${start} at\u00e9 ${end}` : "--";
}

function syncFilterDraftToUi() {
  if (entriesFilterStartDatePicker) entriesFilterStartDatePicker.value = draftEntryFilters.startDate || "";
  if (entriesFilterEndDatePicker) entriesFilterEndDatePicker.value = draftEntryFilters.endDate || "";
  if (selectedEntriesFilterStartDateEl) selectedEntriesFilterStartDateEl.textContent = formatIsoDate(draftEntryFilters.startDate);
  if (selectedEntriesFilterEndDateEl) selectedEntriesFilterEndDateEl.textContent = formatIsoDate(draftEntryFilters.endDate);
  const status = (draftEntryFilters.type === "pending" || draftEntryFilters.type === "deleted")
    ? draftEntryFilters.type
    : "all";
  const directionType = (draftEntryFilters.type === "in" || draftEntryFilters.type === "out")
    ? draftEntryFilters.type
    : "all";
  if (entriesFilterStatus) entriesFilterStatus.value = status;
  if (entriesFilterType) entriesFilterType.value = directionType;
  const statusMode = status === "pending" || status === "deleted";
  if (openEntriesFilterStartDateBtn) openEntriesFilterStartDateBtn.disabled = statusMode;
  if (openEntriesFilterEndDateBtn) openEntriesFilterEndDateBtn.disabled = statusMode;
  if (entriesFilterType) entriesFilterType.disabled = statusMode;
  if (entriesFilterCategories) entriesFilterCategories.style.pointerEvents = statusMode ? "none" : "";
  if (entriesFilterCategories) entriesFilterCategories.style.opacity = statusMode ? "0.5" : "";

  const selected = new Set(draftEntryFilters.categories || []);
  const categoriesHtml = categories.map((category) => {
    const name = String(category?.name || "").trim();
    const type = String(category?.type || "");
    const selectedClass = selected.has(name) ? " is-selected" : "";
    const tone = type === "in" ? "is-in" : "is-out";
    return `<button type="button" class="filter-category-chip ${tone}${selectedClass}" data-category="${encodeURIComponent(name)}">${escapeHtml(name)}</button>`;
  }).join("");
  if (entriesFilterCategories) entriesFilterCategories.innerHTML = categoriesHtml;
}

function applyTypeRulesOnDraft(type) {
  const previousType = String(draftEntryFilters.type || "all");
  draftEntryFilters.type = type;
  const ins = categories.filter((c) => String(c?.type || "") === "in").map((c) => String(c?.name || ""));
  const outs = categories.filter((c) => String(c?.type || "") === "out").map((c) => String(c?.name || ""));
  const current = new Set(draftEntryFilters.categories || []);

  if (type === "deleted" || type === "pending") {
    if (previousType !== "deleted" && previousType !== "pending") {
      lastScopedEntryFilters = {
        startDate: String(draftEntryFilters.startDate || ""),
        endDate: String(draftEntryFilters.endDate || ""),
        categories: [...(draftEntryFilters.categories || [])],
      };
    }
    draftEntryFilters.startDate = "";
    draftEntryFilters.endDate = "";
    draftEntryFilters.categories = [];
    return;
  }
  if (type === "all") {
    if (previousType === "deleted" || previousType === "pending") {
      const bounds = currentMonthBounds();
      draftEntryFilters.startDate = String(lastScopedEntryFilters.startDate || bounds.start);
      draftEntryFilters.endDate = String(lastScopedEntryFilters.endDate || bounds.end);
      draftEntryFilters.categories = (lastScopedEntryFilters.categories || []).length
        ? [...lastScopedEntryFilters.categories]
        : categories.map((c) => String(c?.name || ""));
      return;
    }
    draftEntryFilters.categories = categories.map((c) => String(c?.name || ""));
    return;
  }
  if (type === "in") {
    const inSelected = ins.some((name) => current.has(name));
    draftEntryFilters.categories = inSelected ? ins.filter((name) => current.has(name)) : ins;
    return;
  }
  const outSelected = outs.some((name) => current.has(name));
  draftEntryFilters.categories = outSelected ? outs.filter((name) => current.has(name)) : outs;
}

function startSearchDebouncedReload() {
  if (searchDebounceTimer) window.clearTimeout(searchDebounceTimer);
  searchDebounceTimer = window.setTimeout(() => {
    void loadDashboard();
  }, 220);
}

async function openEntryFiltersModal() {
  await loadCategories();
  draftEntryFilters = { ...entryFilters, categories: [...entryFilters.categories] };
  syncFilterDraftToUi();
  await entriesFilterModal?.present();
}

async function closeEntryFiltersModal() {
  try {
    await entriesFilterModal?.dismiss();
  } catch {
    // modal may already be closed
  }
}

async function openEntryEditor(entryId) {
  const entry = loadedEntriesIndex.get(Number(entryId));
  if (!entry) return;
  await loadCategories();
  await loadAccounts(true);
  resetEntryForm();
  editingEntryId = Number(entry.id || 0);
  editingEntryUserId = Number(entry.user_id || 0);
  editingEntryAttachmentPath = String(entry.attachment_path || "");
  const deletedAtRaw = entry?.deleted_at;
  const deletedAtText = typeof deletedAtRaw === "string" ? deletedAtRaw.trim().toLowerCase() : "";
  const hasDeletedAt = deletedAtRaw != null && deletedAtText !== "" && deletedAtText !== "null" && deletedAtText !== "0";
  const status = String(entry?.status || "").toLowerCase();
  const hasDeletedStatus = status === "deleted_soft" || status === "deleted_hard";
  editingEntryDeleted = hasDeletedAt || hasDeletedStatus;
  editingEntryPending = Number(entry?.needs_review || 0) === 1 || status === "pending";
  editingEntryTypeFallback = String(entry?.type || "");
  if (entryAmountInput) entryAmountInput.value = formatMoneyInput(Number(entry.amount || 0));
  selectedCategoryValue = String(entry.category || "");
  if (selectedCategoryEl) {
    selectedCategoryEl.textContent = selectedCategoryValue || "Selecionar categoria";
    selectedCategoryEl.classList.toggle("is-placeholder", !selectedCategoryValue);
  }
  setEntryDirectionHint(selectedCategoryValue);
  setEntryTheme(entryTypeFromSelectedCategory() || "neutral");
  selectedAccountId = Number(entry.account_id || 0);
  if (selectedAccountEl) {
    const accountName = String(entry.account_name || "").trim();
    selectedAccountEl.textContent = accountName || "Selecionar conta/cartão";
    selectedAccountEl.classList.toggle("is-placeholder", !accountName);
  }
  setEntryModalMode(editingEntryDeleted ? "deleted" : "edit");
  selectedDateISO = String(entry.date || todayIsoDate()).slice(0, 10);
  if (datePicker) datePicker.value = selectedDateISO;
  if (selectedDateEl) {
    selectedDateEl.textContent = formatIsoDate(selectedDateISO);
    selectedDateEl.classList.remove("is-placeholder");
  }
  if (entryDescriptionInput) entryDescriptionInput.value = String(entry.description || "");
  setAttachmentPreviewFromPath(editingEntryAttachmentPath);
  updateSaveState();
  await entryModal?.present();
  setEntryLayerState(true);
}

function setupEntriesInteractions() {
  openEntryFiltersSummaryBtn?.addEventListener("click", () => {
    void openEntryFiltersModal();
  });
  filterPanel?.addEventListener("click", () => {
    void openEntryFiltersModal();
  });
  closeEntryFiltersBtn?.addEventListener("click", () => void closeEntryFiltersModal());
  cancelEntryFiltersBtn?.addEventListener("click", () => void closeEntryFiltersModal());

  clearEntryFiltersBtn?.addEventListener("click", () => {
    const bounds = currentMonthBounds();
    draftEntryFilters = { startDate: bounds.start, endDate: bounds.end, type: "all", categories: categories.map((c) => String(c?.name || "")) };
    syncFilterDraftToUi();
    entryFilters = { ...draftEntryFilters, categories: [...draftEntryFilters.categories] };
    formatFilterPanel();
    void closeEntryFiltersModal();
    void loadDashboard();
  });

  applyEntryFiltersBtn?.addEventListener("click", () => {
    entryFilters = { ...draftEntryFilters, categories: [...draftEntryFilters.categories] };
    if (entryFilters.type === "deleted") {
      entriesSearchTerm = "";
      if (entriesSearchInput) entriesSearchInput.value = "";
    }
    formatFilterPanel();
    void closeEntryFiltersModal();
    void loadDashboard();
  });

  entriesFilterType?.addEventListener("ionChange", (event) => {
    const type = String(event?.detail?.value || "all");
    applyTypeRulesOnDraft(type);
    syncFilterDraftToUi();
  });

  entriesFilterStatus?.addEventListener("ionChange", (event) => {
    const status = String(event?.detail?.value || "all");
    applyTypeRulesOnDraft(status);
    syncFilterDraftToUi();
  });

  entriesFilterCategories?.addEventListener("click", (event) => {
    if (draftEntryFilters.type === "deleted") return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest(".filter-category-chip");
    if (!button) return;
    const name = decodeURIComponent(String(button.getAttribute("data-category") || ""));
    const selected = new Set(draftEntryFilters.categories || []);
    if (selected.has(name)) selected.delete(name); else selected.add(name);
    draftEntryFilters.categories = [...selected];
    syncFilterDraftToUi();
  });

  openEntriesFilterStartDateBtn?.addEventListener("click", async () => {
    await entriesFilterStartDateModal?.present();
  });
  openEntriesFilterEndDateBtn?.addEventListener("click", async () => {
    await entriesFilterEndDateModal?.present();
  });
  closeEntriesFilterStartDateModalBtn?.addEventListener("click", async () => {
    try { await entriesFilterStartDateModal?.dismiss(); } catch {}
  });
  closeEntriesFilterEndDateModalBtn?.addEventListener("click", async () => {
    try { await entriesFilterEndDateModal?.dismiss(); } catch {}
  });

  entriesFilterStartDatePicker?.addEventListener("ionChange", (event) => {
    const value = String(event?.detail?.value || "").slice(0, 10);
    if (!value) return;
    draftEntryFilters.startDate = value;
    syncFilterDraftToUi();
    void entriesFilterStartDateModal?.dismiss();
  });

  entriesFilterEndDatePicker?.addEventListener("ionChange", (event) => {
    const value = String(event?.detail?.value || "").slice(0, 10);
    if (!value) return;
    draftEntryFilters.endDate = value;
    syncFilterDraftToUi();
    void entriesFilterEndDateModal?.dismiss();
  });

  entriesSearchInput?.addEventListener("input", () => {
    if (entryFilters.type === "deleted") {
      entriesSearchInput.value = "";
      entriesSearchTerm = "";
      return;
    }
    entriesSearchTerm = String(entriesSearchInput.value || "").trim();
    startSearchDebouncedReload();
  });

  entriesList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest(".entry-row--button");
    if (!button) return;
    const entryId = Number(button.getAttribute("data-entry-id") || 0);
    if (entryId > 0) {
      void openEntryEditor(entryId);
    }
  });

  categoriesListScreen?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest(".cat-row--button");
    if (!button) return;
    const encoded = String(button.getAttribute("data-category-name") || "").trim();
    const categoryName = encoded ? decodeURIComponent(encoded) : "";
    if (!categoryName) return;
    void openCategoryDetailModal(categoryName);
  });

  accountsListScreen?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-account-id]");
    if (!button) return;
    const accountId = Number(button.getAttribute("data-account-id") || 0);
    if (accountId <= 0) return;
    void openAccountDetailModal(accountId);
  });

  closeCategoryDetailModalBtn?.addEventListener("click", () => {
    void closeCategoryDetailModal();
  });

  editCategoryFromDetailBtn?.addEventListener("click", () => {
    if (!currentDetailCategoryName || currentDetailEditableCategoryId <= 0) {
      showError("Somente categorias do usuário podem ser editadas.");
      return;
    }
    const category = categories.find((item) => Number(item?.id || 0) === currentDetailEditableCategoryId);
    if (!category || String(category?.scope || "global") !== "user") {
      showError("Somente categorias do usuário podem ser editadas.");
      return;
    }
    void closeCategoryDetailModal().then(() => openUserCategoryEditModal(category));
  });

  deleteCategoryFromDetailBtn?.addEventListener("click", () => {
    void deleteUserCategoryFromDetail();
  });

  closeAccountDetailModalBtn?.addEventListener("click", () => {
    void closeAccountDetailModal();
  });

  editAccountFromDetailBtn?.addEventListener("click", () => {
    if (currentDetailAccountId <= 0) {
      showError("Conta/cartão inválido para edição.");
      return;
    }
    const account = accounts.find((item) => Number(item?.id || 0) === currentDetailAccountId);
    if (!account) {
      showError("Conta/cartão inválido para edição.");
      return;
    }
    void closeAccountDetailModal().then(() => openUserAccountEditModal(account));
  });

  deleteAccountFromDetailBtn?.addEventListener("click", () => {
    void deleteUserAccountFromDetail();
  });
}

function renderRows(container, items, mode, emptyText) {
  if (!Array.isArray(items) || items.length === 0) {
    container.innerHTML = `
      <div class="row">
        <div class="icon-circle"><span class="material-symbols-rounded">check</span></div>
        <div>
          <div class="row-title">Sem itens</div>
          <div class="row-meta">${escapeHtml(emptyText)}</div>
        </div>
        <div class="row-value pos">OK</div>
      </div>
    `;
    return;
  }
  container.innerHTML = items.map((item) => rowTemplate(item, mode)).join("");
}

function sortEntriesByDateDesc(items) {
  return [...items].sort((a, b) => {
    const dateA = String(a?.date || "");
    const dateB = String(b?.date || "");
    const byDate = dateB.localeCompare(dateA);
    if (byDate !== 0) return byDate;
    const updatedA = String(a?.updated_at || a?.created_at || "");
    const updatedB = String(b?.updated_at || b?.created_at || "");
    return updatedB.localeCompare(updatedA);
  });
}

function renderCategories(items) {
  const top = (Array.isArray(items) ? items : []).slice(0, 4);
  if (!top.length) {
    catGrid.innerHTML = `
      <div class="budget-item">
        <div class="budget-ring">
          <svg class="budget-ring__svg" viewBox="0 0 36 36" aria-hidden="true">
            <circle class="budget-ring__track" cx="18" cy="18" r="15.915"></circle>
            <circle class="budget-ring__value" cx="18" cy="18" r="15.915" pathLength="100" stroke-dasharray="7 100"></circle>
          </svg>
          <span class="budget-ring__inner"><span class="material-symbols-rounded">savings</span></span>
        </div>
        <span>Sem dados</span>
      </div>
    `;
    return;
  }

  catGrid.innerHTML = top
    .map((item) => {
      const pct = Number(item.share || 0);
      const fill = Math.max(4, Math.min(98, Math.round(pct)));
      const name = escapeHtml(item.name || "Categoria");
      return `
        <div class="budget-item" title="${name}">
          <div class="budget-ring">
            <svg class="budget-ring__svg" viewBox="0 0 36 36" aria-hidden="true">
              <circle class="budget-ring__track" cx="18" cy="18" r="15.915"></circle>
              <circle class="budget-ring__value" cx="18" cy="18" r="15.915" pathLength="100" stroke-dasharray="${fill} 100"></circle>
            </svg>
            <span class="budget-ring__inner"><span class="material-symbols-rounded">${categoryGlyph(item.name)}</span></span>
          </div>
          <span>${money.format(Number(item.out || 0))}</span>
        </div>
      `;
    })
    .join("");
}

function hashString(value) {
  const key = normalizeText(value);
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = ((hash << 5) - hash) + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function clampByte(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function hslToRgbBytes(h, s, l) {
  const hue = (((Number(h) % 360) + 360) % 360) / 360;
  const sat = Math.max(0, Math.min(100, Number(s))) / 100;
  const lig = Math.max(0, Math.min(100, Number(l))) / 100;
  if (sat === 0) {
    const gray = clampByte(lig * 255);
    return [gray, gray, gray];
  }
  const q = lig < 0.5 ? lig * (1 + sat) : lig + sat - (lig * sat);
  const p = (2 * lig) - q;
  const tc = [hue + (1 / 3), hue, hue - (1 / 3)];
  const rgb = tc.map((tRaw) => {
    let t = tRaw;
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    let c = p;
    if (t < (1 / 6)) c = p + ((q - p) * 6 * t);
    else if (t < (1 / 2)) c = q;
    else if (t < (2 / 3)) c = p + ((q - p) * ((2 / 3) - t) * 6);
    return clampByte(c * 255);
  });
  return [rgb[0], rgb[1], rgb[2]];
}

function rgbBytesToHex(r, g, b) {
  const toHex = (n) => clampByte(n).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
  const clean = String(hex || "").trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return [0, 0, 0];
  return [
    Number.parseInt(clean.slice(0, 2), 16),
    Number.parseInt(clean.slice(2, 4), 16),
    Number.parseInt(clean.slice(4, 6), 16),
  ];
}

function srgbToLinear(channelByte) {
  const c = clampByte(channelByte) / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(hexA, hexB) {
  const [r1, g1, b1] = hexToRgb(hexA);
  const [r2, g2, b2] = hexToRgb(hexB);
  const l1 = (0.2126 * srgbToLinear(r1)) + (0.7152 * srgbToLinear(g1)) + (0.0722 * srgbToLinear(b1));
  const l2 = (0.2126 * srgbToLinear(r2)) + (0.7152 * srgbToLinear(g2)) + (0.0722 * srgbToLinear(b2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function hueDistance(a, b) {
  const diff = Math.abs(a - b) % 360;
  return Math.min(diff, 360 - diff);
}

function isHueInRange(hue, start, end) {
  if (start <= end) return hue >= start && hue <= end;
  return hue >= start || hue <= end;
}

function isForbiddenCategoryHue(hue) {
  // Reservado para semântica financeira (positivo/negativo).
  const redBand = isHueInRange(hue, 345, 18);
  const greenBand = isHueInRange(hue, 88, 154);
  return redBand || greenBand;
}

function moveHueToAllowed(hue) {
  let candidate = ((Number(hue) % 360) + 360) % 360;
  if (!isForbiddenCategoryHue(candidate)) return candidate;
  for (let step = 1; step < 360; step += 1) {
    const forward = (candidate + step) % 360;
    if (!isForbiddenCategoryHue(forward)) return forward;
    const backward = (candidate - step + 360) % 360;
    if (!isForbiddenCategoryHue(backward)) return backward;
  }
  return 220;
}

function pickDistinctHue(baseHue, usedHues, minGap) {
  const safeBase = moveHueToAllowed(baseHue);
  if (!usedHues.length) return safeBase;
  let bestHue = baseHue;
  let bestScore = -1;
  for (let step = 0; step < 360; step += 3) {
    const forward = (safeBase + step) % 360;
    const backward = (safeBase - step + 360) % 360;
    for (const candidate of [forward, backward]) {
      if (isForbiddenCategoryHue(candidate)) continue;
      const nearest = Math.min(...usedHues.map((h) => hueDistance(candidate, h)));
      if (nearest >= minGap) return candidate;
      if (nearest > bestScore) {
        bestScore = nearest;
        bestHue = candidate;
      }
    }
  }
  return bestHue;
}

function buildCategoryToneMap(categoryNames) {
  const unique = Array.from(new Set((Array.isArray(categoryNames) ? categoryNames : [])
    .map((name) => String(name || "").trim())
    .filter(Boolean)));

  const result = new Map();
  if (!unique.length) return result;

  const canvasHex = "#eef1f5";
  const minHueGap = Math.max(14, Math.min(34, Math.floor(320 / Math.max(unique.length, 1))));
  const usedHues = [];

  const ordered = unique
    .map((name) => ({ name, hash: hashString(name) }))
    .sort((a, b) => a.hash - b.hash);

  for (const item of ordered) {
    const baseHue = Math.round((item.hash * 137.508) % 360);
    const safeBaseHue = moveHueToAllowed(baseHue);
    const hue = pickDistinctHue(safeBaseHue, usedHues, minHueGap);
    usedHues.push(hue);

    const sat = 74;
    let fgLight = 40;
    let fgHex = rgbBytesToHex(...hslToRgbBytes(hue, sat, fgLight));
    while (fgLight > 18 && contrastRatio(fgHex, canvasHex) < 4.6) {
      fgLight -= 2;
      fgHex = rgbBytesToHex(...hslToRgbBytes(hue, sat, fgLight));
    }

    const bgHex = rgbBytesToHex(...hslToRgbBytes(hue, 52, 92));
    result.set(item.name, {
      fg: fgHex,
      bg: bgHex,
      hue,
    });
  }
  return result;
}

function categoryBalance(item) {
  const inValue = Number(item?.in || 0);
  const outValue = Number(item?.out || 0);
  const explicitBalance = Number(item?.balance);
  if (Number.isFinite(explicitBalance)) return explicitBalance;
  return inValue - outValue;
}

function updateTopSummaryPanel(
  currentItems,
  previousItems,
  getBalance,
  getName,
  currentBalanceOverride = null,
  previousBalanceOverride = null,
  donutColorResolver = null,
) {
  const currList = Array.isArray(currentItems) ? currentItems : [];
  const prevList = Array.isArray(previousItems) ? previousItems : [];

  const computedCurrentBalance = currList.reduce((acc, item) => acc + Number(getBalance(item) || 0), 0);
  const computedPreviousBalance = prevList.reduce((acc, item) => acc + Number(getBalance(item) || 0), 0);
  const hasCurrentOverride = currentBalanceOverride !== null && currentBalanceOverride !== undefined && currentBalanceOverride !== "";
  const hasPreviousOverride = previousBalanceOverride !== null && previousBalanceOverride !== undefined && previousBalanceOverride !== "";
  const currentMonthBalance = hasCurrentOverride && Number.isFinite(Number(currentBalanceOverride))
    ? Number(currentBalanceOverride)
    : computedCurrentBalance;
  const previousMonthBalance = hasPreviousOverride && Number.isFinite(Number(previousBalanceOverride))
    ? Number(previousBalanceOverride)
    : computedPreviousBalance;

  if (catSoFarEl) {
    catSoFarEl.textContent = money.format(currentMonthBalance);
    catSoFarEl.classList.remove("pos", "neg");
    catSoFarEl.classList.add(currentMonthBalance >= 0 ? "pos" : "neg");
  }
  if (catLastMonthEl) {
    catLastMonthEl.textContent = money.format(previousMonthBalance);
    catLastMonthEl.classList.remove("pos", "neg");
    catLastMonthEl.classList.add(previousMonthBalance >= 0 ? "pos" : "neg");
  }

  const donutItems = currList
    .map((item) => ({ name: String(getName(item) || "").trim(), value: Math.abs(Number(getBalance(item) || 0)) }))
    .filter((item) => item.name && item.value > 0)
    .sort((a, b) => b.value - a.value);

  const toneMap = buildCategoryToneMap([
    ...currList.map((item) => String(getName(item) || "")),
    ...prevList.map((item) => String(getName(item) || "")),
  ]);

  const donutTotal = donutItems.reduce((acc, item) => acc + item.value, 0);
  if (catDonutEl) {
    if (!donutTotal) {
      catDonutEl.style.background = "conic-gradient(#dfe4ee 0turn 1turn)";
    } else {
      let cursor = 0;
      const segments = donutItems.map((item) => {
        const fraction = item.value / donutTotal;
        const start = cursor;
        cursor += fraction;
        let color = "";
        if (typeof donutColorResolver === "function") {
          const sourceItem = currList.find((entry) => String(getName(entry) || "").trim() === item.name) || null;
          color = String(donutColorResolver(sourceItem, item.name, Number(getBalance(sourceItem) || 0)) || "").trim();
        }
        if (!color) {
          const tone = toneMap.get(item.name);
          color = tone?.fg || "#2b7fff";
        }
        return `${color} ${start}turn ${cursor}turn`;
      });
      catDonutEl.style.background = `conic-gradient(${segments.join(", ")})`;
    }
  }
}

function categoryTypeByName(name) {
  const normalized = normalizeText(name);
  const match = categories.find((item) => normalizeText(item?.name || "") === normalized);
  const type = String(match?.type || "").trim();
  if (type === "in" || type === "out") return type;
  return "out";
}

function monthKeyFromIso(isoDate) {
  const value = String(isoDate || "").slice(0, 7);
  if (!/^\d{4}-\d{2}$/.test(value)) return "";
  return value;
}

function monthLabelFromKey(monthKey) {
  const [year, month] = String(monthKey || "").split("-").map((value) => Number(value));
  if (!Number.isFinite(year) || !Number.isFinite(month)) return "";
  const date = new Date(year, month - 1, 1);
  const raw = date.toLocaleDateString("pt-BR", { month: "long" }).trim();
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function monthLabelWithoutYear(label, fallbackMonthKey = "") {
  const source = String(label || "").trim();
  if (!source && fallbackMonthKey) return monthLabelFromKey(fallbackMonthKey);
  if (!source) return "";
  const cleaned = source
    .replace(/\s+de\s+\d{4}$/i, "")
    .replace(/\s+\d{4}$/i, "")
    .trim();
  if (!cleaned) return fallbackMonthKey ? monthLabelFromKey(fallbackMonthKey) : "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function monthInitialFromKey(monthKey) {
  const [year, month] = String(monthKey || "").split("-").map((value) => Number(value));
  if (!Number.isFinite(year) || !Number.isFinite(month)) return "";
  const date = new Date(year, month - 1, 1);
  const short = String(date.toLocaleDateString("pt-BR", { month: "short" }) || "").trim();
  const normalized = short.replace(".", "");
  return normalized ? normalized.charAt(0).toUpperCase() : "";
}

function dayMonthShortLabel(isoDate) {
  const value = String(isoDate || "").slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
  const [year, month, day] = value.split("-").map((part) => Number(part));
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return "";
  const date = new Date(year, month - 1, day);
  const weekdayRaw = String(date.toLocaleDateString("pt-BR", { weekday: "short" }) || "").trim();
  const weekday = weekdayRaw.replace(".", "").slice(0, 3).toUpperCase();
  const monthShortRaw = String(date.toLocaleDateString("pt-BR", { month: "short" }) || "").trim();
  const monthShort = monthShortRaw.replace(".", "").slice(0, 3).toUpperCase();
  return `${weekday}, ${String(day).padStart(2, "0")}/${monthShort}`;
}

function dayGroupLabel(dayNode) {
  const direct = String(dayNode?.date || dayNode?.day || "").slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(direct)) return dayMonthShortLabel(direct);
  const firstEntryDate = String((Array.isArray(dayNode?.entries) && dayNode.entries[0]?.date) || "").slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(firstEntryDate)) return dayMonthShortLabel(firstEntryDate);
  return String(dayNode?.label || "").trim().toUpperCase();
}

function buildCategoryMonthlyBars(categoryName) {
  const keyNow = monthRange();
  const [yearNow, monthNow] = keyNow.split("-").map((value) => Number(value));
  const months = [];
  for (let i = 17; i >= 0; i -= 1) {
    const date = new Date(yearNow, monthNow - 1 - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, label: monthInitialFromKey(key) });
  }
  const map = new Map(months.map((item) => [item.key, 0]));
  const normalizedCategory = normalizeText(categoryName);
  dashboardEntriesCache.forEach((entry) => {
    if (Number(entry?.deleted || 0) === 1) return;
    if (normalizeText(entry?.category || "") !== normalizedCategory) return;
    const key = monthKeyFromIso(entry?.date || "");
    if (!map.has(key)) return;
    map.set(key, Number(map.get(key) || 0) + Number(entry?.amount || 0));
  });
  const values = months.map((item) => Number(map.get(item.key) || 0));
  const max = Math.max(...values, 1);
  return months.map((item, idx) => ({
    label: item.label,
    value: values[idx],
    ratio: Math.max(6, Math.round((values[idx] / max) * 100)),
  }));
}

function signedEntryAmount(entry) {
  const amount = Number(effectiveEntryAmount(entry));
  return entry?.type === "out" ? -1 * amount : amount;
}

function effectiveEntryAmount(entry) {
  const isPending = Number(entry?.needs_review ?? entry?.needsReview ?? 0) === 1;
  if (isPending) {
    const valid = entry?.valid_amount ?? entry?.validAmount;
    if (valid !== null && valid !== undefined && valid !== "") {
      const parsedValid = Number(valid);
      if (Number.isFinite(parsedValid)) return parsedValid;
    }
  }
  const raw = Number(entry?.amount || 0);
  return Number.isFinite(raw) ? raw : 0;
}

function buildMonthAggregateFromEntries(entries, monthKey) {
  const rows = (Array.isArray(entries) ? entries : []).filter((entry) => {
    const date = String(entry?.date || "").slice(0, 7);
    const deleted = Number(entry?.deleted || 0) === 1 || Boolean(entry?.deleted_at || entry?.deletedAt);
    return !deleted && date === monthKey;
  });

  const byCategoryMap = new Map();
  const byAccountMap = new Map();

  rows.forEach((entry) => {
    const type = String(entry?.type || "out") === "in" ? "in" : "out";
    const amount = Math.abs(Number(effectiveEntryAmount(entry)) || 0);

    const categoryName = String(entry?.category || "").trim() || "Sem categoria";
    if (!byCategoryMap.has(categoryName)) {
      byCategoryMap.set(categoryName, { name: categoryName, in: 0, out: 0 });
    }
    const category = byCategoryMap.get(categoryName);
    category[type] += amount;

    const accountName = String(entry?.account_name || entry?.accountName || "").trim() || "Sem conta/cartão";
    const accountType = String(entry?.account_type || entry?.accountType || "bank");
    const accountId = Number(entry?.account_id || entry?.accountId || 0);
    const accountKey = `${accountId > 0 ? accountId : "name"}:${normalizeText(accountName)}`;
    if (!byAccountMap.has(accountKey)) {
      byAccountMap.set(accountKey, {
        id: accountId,
        name: accountName,
        type: accountType,
        in: 0,
        out: 0,
        initial_balance: 0,
      });
    }
    const account = byAccountMap.get(accountKey);
    account[type] += amount;
  });

  const byCategory = Array.from(byCategoryMap.values());
  const byAccount = Array.from(byAccountMap.values());

  const categoryTotal = byCategory.reduce((acc, item) => acc + Number(item.in || 0) + Number(item.out || 0), 0);
  byCategory.forEach((item) => {
    const total = Number(item.in || 0) + Number(item.out || 0);
    item.share = categoryTotal > 0 ? Math.round((total / categoryTotal) * 100) : 0;
    item.balance = Number(item.in || 0) - Number(item.out || 0);
  });
  byCategory.sort((a, b) => ((Number(b.in || 0) + Number(b.out || 0)) - (Number(a.in || 0) + Number(a.out || 0))));

  const accountTotal = byAccount.reduce((acc, item) => acc + Number(item.in || 0) + Number(item.out || 0), 0);
  byAccount.forEach((item) => {
    const total = Number(item.in || 0) + Number(item.out || 0);
    item.share = accountTotal > 0 ? Math.round((total / accountTotal) * 100) : 0;
    item.balance = Number(item.initial_balance || 0) + Number(item.in || 0) - Number(item.out || 0);
  });
  byAccount.sort((a, b) => ((Number(b.in || 0) + Number(b.out || 0)) - (Number(a.in || 0) + Number(a.out || 0))));

  return { by_category: byCategory, by_account: byAccount };
}

function extractEntriesFromGroups(groups) {
  const result = [];
  const years = Array.isArray(groups) ? groups : [];
  years.forEach((yearNode) => {
    const months = Array.isArray(yearNode?.months) ? yearNode.months : [];
    months.forEach((monthNode) => {
      const days = Array.isArray(monthNode?.days) ? monthNode.days : [];
      days.forEach((dayNode) => {
        const entries = Array.isArray(dayNode?.entries) ? dayNode.entries : [];
        entries.forEach((entry) => result.push(entry));
      });
    });
  });
  return result;
}

function buildCategoryEntriesHierarchy(categoryName) {
  const normalizedCategory = normalizeText(categoryName);
  const filtered = dashboardEntriesCache
    .filter((entry) => Number(entry?.deleted || 0) !== 1)
    .filter((entry) => normalizeText(entry?.category || "") === normalizedCategory)
    .sort((a, b) => String(b?.date || "").localeCompare(String(a?.date || "")));

  const yearsMap = new Map();
  filtered.forEach((entry) => {
    const iso = String(entry?.date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
    const yearKey = iso.slice(0, 4);
    const monthKey = iso.slice(0, 7);
    const signed = signedEntryAmount(entry);

    if (!yearsMap.has(yearKey)) {
      yearsMap.set(yearKey, { yearKey, total: 0, monthsMap: new Map() });
    }
    const yearNode = yearsMap.get(yearKey);
    yearNode.total += signed;

    if (!yearNode.monthsMap.has(monthKey)) {
      yearNode.monthsMap.set(monthKey, { monthKey, total: 0, daysMap: new Map() });
    }
    const monthNode = yearNode.monthsMap.get(monthKey);
    monthNode.total += signed;
    const dayKey = iso;
    if (!monthNode.daysMap.has(dayKey)) {
      monthNode.daysMap.set(dayKey, { dayKey, total: 0, entries: [] });
    }
    const dayNode = monthNode.daysMap.get(dayKey);
    dayNode.total += signed;
    dayNode.entries.push(entry);
  });

  return [...yearsMap.values()]
    .sort((a, b) => b.yearKey.localeCompare(a.yearKey))
    .map((yearNode) => ({
      yearKey: yearNode.yearKey,
      total: yearNode.total,
      months: [...yearNode.monthsMap.values()]
        .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
        .map((monthNode) => ({
          monthKey: monthNode.monthKey,
          total: monthNode.total,
          days: [...monthNode.daysMap.values()]
            .sort((a, b) => b.dayKey.localeCompare(a.dayKey)),
        })),
    }));
}

function buildCategoryGroupsForLaunchListPattern(categoryName) {
  const hierarchy = buildCategoryEntriesHierarchy(categoryName);
  return hierarchy.map((yearNode) => ({
    year: yearNode.yearKey,
    label: yearNode.yearKey,
    totals: { balance: Number(yearNode.total || 0) },
    months: (Array.isArray(yearNode.months) ? yearNode.months : []).map((monthNode) => ({
      month: monthNode.monthKey,
      label: monthLabelFromKey(monthNode.monthKey),
      totals: { balance: Number(monthNode.total || 0) },
      days: (Array.isArray(monthNode.days) ? monthNode.days : []).map((dayNode) => ({
        day: dayNode.dayKey,
        label: dayMonthShortLabel(dayNode.dayKey),
        totals: { balance: Number(dayNode.total || 0) },
        entries: (Array.isArray(dayNode.entries) ? dayNode.entries : []).map((entry) => ({
          ...entry,
          category: String(entry?.category || categoryName || "").trim(),
        })),
      })),
    })),
  }));
}

function buildAccountMonthlyBars(accountName) {
  const keyNow = monthRange();
  const [yearNow, monthNow] = keyNow.split("-").map((value) => Number(value));
  const months = [];
  for (let i = 17; i >= 0; i -= 1) {
    const date = new Date(yearNow, monthNow - 1 - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, label: monthInitialFromKey(key) });
  }
  const map = new Map(months.map((item) => [item.key, 0]));
  const normalizedAccount = normalizeText(accountName);
  dashboardEntriesCache.forEach((entry) => {
    if (Number(entry?.deleted || 0) === 1) return;
    if (normalizeText(entry?.account_name || "") !== normalizedAccount) return;
    const key = monthKeyFromIso(entry?.date || "");
    if (!map.has(key)) return;
    map.set(key, Number(map.get(key) || 0) + Number(entry?.amount || 0));
  });
  const values = months.map((item) => Number(map.get(item.key) || 0));
  const max = Math.max(...values, 1);
  return months.map((item, idx) => ({
    label: item.label,
    value: values[idx],
    ratio: Math.max(6, Math.round((values[idx] / max) * 100)),
  }));
}

function buildAccountEntriesHierarchy(accountName) {
  const normalizedAccount = normalizeText(accountName);
  const filtered = dashboardEntriesCache
    .filter((entry) => Number(entry?.deleted || 0) !== 1)
    .filter((entry) => normalizeText(entry?.account_name || "") === normalizedAccount)
    .sort((a, b) => String(b?.date || "").localeCompare(String(a?.date || "")));

  const yearsMap = new Map();
  filtered.forEach((entry) => {
    const iso = String(entry?.date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
    const yearKey = iso.slice(0, 4);
    const monthKey = iso.slice(0, 7);
    const signed = signedEntryAmount(entry);
    if (!yearsMap.has(yearKey)) {
      yearsMap.set(yearKey, { yearKey, total: 0, monthsMap: new Map() });
    }
    const yearNode = yearsMap.get(yearKey);
    yearNode.total += signed;
    if (!yearNode.monthsMap.has(monthKey)) {
      yearNode.monthsMap.set(monthKey, { monthKey, total: 0, daysMap: new Map() });
    }
    const monthNode = yearNode.monthsMap.get(monthKey);
    monthNode.total += signed;
    const dayKey = iso;
    if (!monthNode.daysMap.has(dayKey)) {
      monthNode.daysMap.set(dayKey, { dayKey, total: 0, entries: [] });
    }
    const dayNode = monthNode.daysMap.get(dayKey);
    dayNode.total += signed;
    dayNode.entries.push(entry);
  });

  return [...yearsMap.values()]
    .sort((a, b) => b.yearKey.localeCompare(a.yearKey))
    .map((yearNode) => ({
      yearKey: yearNode.yearKey,
      total: yearNode.total,
      months: [...yearNode.monthsMap.values()]
        .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
        .map((monthNode) => ({
          monthKey: monthNode.monthKey,
          total: monthNode.total,
          days: [...monthNode.daysMap.values()]
            .sort((a, b) => b.dayKey.localeCompare(a.dayKey)),
        })),
    }));
}

function buildAccountGroupsForLaunchListPattern(accountName) {
  const hierarchy = buildAccountEntriesHierarchy(accountName);
  return hierarchy.map((yearNode) => ({
    year: yearNode.yearKey,
    label: yearNode.yearKey,
    totals: { balance: Number(yearNode.total || 0) },
    months: (Array.isArray(yearNode.months) ? yearNode.months : []).map((monthNode) => ({
      month: monthNode.monthKey,
      label: monthLabelFromKey(monthNode.monthKey),
      totals: { balance: Number(monthNode.total || 0) },
      days: (Array.isArray(monthNode.days) ? monthNode.days : []).map((dayNode) => ({
        day: dayNode.dayKey,
        label: dayMonthShortLabel(dayNode.dayKey),
        totals: { balance: Number(dayNode.total || 0) },
        entries: (Array.isArray(dayNode.entries) ? dayNode.entries : []).map((entry) => ({
          ...entry,
          category: String(entry?.category || "").trim(),
        })),
      })),
    })),
  }));
}

function renderCategoryDetailModal(categoryName) {
  if (!categoryDetailModal || !categoryDetailTitleEl || !categoryDetailTotalEl || !categoryDetailBarsEl || !categoryDetailListEl) return;
  const meta = categoryRowsIndex.get(categoryName);
  if (!meta) return;
  currentDetailCategoryName = categoryName;
  const categoryType = categoryTypeByName(categoryName);
  const graphColor = categoryType === "in" ? "#2f925f" : "#c95b5b";
  const sameNameCategories = categories.filter((item) => normalizeText(item?.name || "") === normalizeText(categoryName));
  const hasGlobalCategory = sameNameCategories.some((item) => String(item?.scope || "global") === "global");
  const globalCategoryWithSameName = sameNameCategories.find((item) => String(item?.scope || "global") === "global");
  const editableUserCategory = sameNameCategories.find((item) => String(item?.scope || "global") === "user");
  const isUserCategory = !hasGlobalCategory && Boolean(editableUserCategory);
  currentDetailEditableCategoryId = isUserCategory ? Number(editableUserCategory?.id || 0) : 0;
  currentDetailGlobalCategoryName = isUserCategory ? String(editableUserCategory?.global_name || "").trim() : "";
  if (editCategoryFromDetailBtn) {
    editCategoryFromDetailBtn.style.display = isUserCategory ? "" : "none";
    editCategoryFromDetailBtn.disabled = !isUserCategory;
  }
  if (deleteCategoryFromDetailBtn) {
    deleteCategoryFromDetailBtn.style.display = isUserCategory ? "" : "none";
    deleteCategoryFromDetailBtn.disabled = !isUserCategory;
  }
  if (categoryDetailFooterEl) {
    categoryDetailFooterEl.style.display = isUserCategory ? "" : "none";
  }

  categoryDetailTitleEl.textContent = categoryName;
  if (categoryDetailGlobalNameEl) {
    const candidate = String(
      editableUserCategory?.global_name
      || globalCategoryWithSameName?.name
      || currentDetailGlobalCategoryName
      || ""
    ).trim();
    const shouldShow = candidate && normalizeText(candidate) !== normalizeText(categoryName);
    categoryDetailGlobalNameEl.hidden = !shouldShow;
    categoryDetailGlobalNameEl.textContent = shouldShow ? candidate : "";
  }
  categoryDetailTotalEl.textContent = money.format(Number(meta?.currBalance || 0));
  categoryDetailTotalEl.classList.remove("pos", "neg");
  categoryDetailTotalEl.classList.add(Number(meta?.currBalance || 0) >= 0 ? "pos" : "neg");

  const bars = buildCategoryMonthlyBars(categoryName);
  categoryDetailBarsEl.innerHTML = bars
    .map((bar) => `
      <span class="category-detail-bars__item">
        <span class="category-detail-bars__slot">
          <span class="category-detail-bars__bar" style="height:${bar.ratio}%;--bar-color:${graphColor}"></span>
        </span>
        <span class="category-detail-bars__label">${escapeHtml(bar.label)}</span>
      </span>
    `)
    .join("");

  const groups = buildCategoryGroupsForLaunchListPattern(categoryName);
  renderEntriesGroupedFromServer(categoryDetailListEl, groups, "Sem lançamentos para esta categoria.");
}

async function openCategoryDetailModal(categoryName) {
  renderCategoryDetailModal(categoryName);
  await categoryDetailModal?.present();
}

async function closeCategoryDetailModal() {
  currentDetailCategoryName = "";
  currentDetailEditableCategoryId = 0;
  currentDetailGlobalCategoryName = "";
  await categoryDetailModal?.dismiss();
}

function renderAccountDetailModal(accountId) {
  if (!accountDetailModal || !accountDetailTitleEl || !accountDetailTotalEl || !accountDetailBarsEl || !accountDetailListEl) return;
  const meta = accountRowsIndex.get(Number(accountId));
  if (!meta) return;
  currentDetailAccountId = Number(accountId);
  currentDetailAccountName = String(meta?.name || "");
  const graphColor = Number(meta?.currBalance || 0) >= 0 ? "#2f925f" : "#c95b5b";
  if (editAccountFromDetailBtn) {
    editAccountFromDetailBtn.style.display = "";
    editAccountFromDetailBtn.disabled = false;
  }
  if (deleteAccountFromDetailBtn) {
    deleteAccountFromDetailBtn.style.display = "";
    deleteAccountFromDetailBtn.disabled = false;
  }
  if (accountDetailFooterEl) {
    accountDetailFooterEl.style.display = "";
  }

  accountDetailTitleEl.textContent = currentDetailAccountName || "Conta/Cartão";
  accountDetailTotalEl.textContent = money.format(Number(meta?.currBalance || 0));
  accountDetailTotalEl.classList.remove("pos", "neg");
  accountDetailTotalEl.classList.add(Number(meta?.currBalance || 0) >= 0 ? "pos" : "neg");

  const bars = buildAccountMonthlyBars(currentDetailAccountName);
  accountDetailBarsEl.innerHTML = bars
    .map((bar) => `
      <span class="category-detail-bars__item">
        <span class="category-detail-bars__slot">
          <span class="category-detail-bars__bar" style="height:${bar.ratio}%;--bar-color:${graphColor}"></span>
        </span>
        <span class="category-detail-bars__label">${escapeHtml(bar.label)}</span>
      </span>
    `)
    .join("");

  const groups = buildAccountGroupsForLaunchListPattern(currentDetailAccountName);
  renderEntriesGroupedFromServer(accountDetailListEl, groups, "Sem lançamentos para esta conta/cartão.");
}

async function openAccountDetailModal(accountId) {
  renderAccountDetailModal(accountId);
  await accountDetailModal?.present();
}

async function closeAccountDetailModal() {
  currentDetailAccountId = 0;
  currentDetailAccountName = "";
  await accountDetailModal?.dismiss();
}

async function deleteUserAccountFromDetail() {
  if (currentDetailAccountId <= 0) {
    showError("Conta/cartão inválido para exclusão.");
    return;
  }
  const confirmed = await confirmActionModal({
    header: "Excluir conta/cartão",
    message: "Se houver lançamentos vinculados, a conta/cartão será apenas desativada.",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    confirmRole: "destructive",
  });
  if (!confirmed) return;
  try {
    const response = await fetch(`/api/accounts/${currentDetailAccountId}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível excluir conta/cartão."));
      return;
    }
    await closeAccountDetailModal();
    await loadAccounts(true);
    await loadDashboard();
    if (payload?.deactivated) {
      showInfo("Conta/cartão desativada porque possui lançamentos vinculados.");
    } else {
      showInfo("Conta/cartão excluído com sucesso.");
    }
  } catch {
    showError("Falha de rede ao excluir conta/cartão.");
  }
}

async function deleteUserCategoryFromDetail() {
  if (!currentDetailCategoryName || currentDetailEditableCategoryId <= 0) {
    showError("Somente categorias do usuário podem ser excluídas.");
    return;
  }

  const globalName = String(currentDetailGlobalCategoryName || "").trim();
  const warning = globalName
    ? `Os lançamentos desta categoria não serão excluídos. Eles serão movidos para a categoria global <strong>${escapeHtml(globalName)}</strong>.`
    : "Os lançamentos desta categoria não serão excluídos. Eles serão movidos para a categoria global vinculada.";

  const confirmed = await confirmActionModal({
    header: "Excluir categoria",
    message: warning,
    confirmText: "Excluir",
    cancelText: "Cancelar",
    confirmRole: "destructive",
  });
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/user-categories/${currentDetailEditableCategoryId}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível excluir a categoria."));
      return;
    }
    await closeCategoryDetailModal();
    await loadCategories();
    await loadDashboard();
    showInfo("Categoria excluída. Lançamentos movidos para a categoria global.");
  } catch {
    showError("Falha de rede ao excluir a categoria.");
  }
}

function renderCategoriesTab(currentAgg, previousAgg) {
  if (!categoriesListScreen) return;

  const currentItems = Array.isArray(currentAgg?.by_category) ? currentAgg.by_category : [];
  const previousItems = Array.isArray(previousAgg?.by_category) ? previousAgg.by_category : [];
  topSummaryState.categorias.current = currentItems;
  topSummaryState.categorias.previous = previousItems;
  const prevMap = new Map(previousItems.map((item) => [String(item?.name || ""), categoryBalance(item)]));

  const toneMap = buildCategoryToneMap([
    ...currentItems.map((item) => String(item?.name || "")),
    ...previousItems.map((item) => String(item?.name || "")),
  ]);

  const listItems = currentItems
    .map((item) => {
      const name = String(item?.name || "").trim();
      const currBalance = categoryBalance(item);
      const prevBalance = Number(prevMap.get(name) || 0);
      return { name, currBalance, prevBalance };
    })
    .filter((item) => item.name);

  categoryRowsIndex = new Map();

  if (!listItems.length) {
    categoriesListScreen.innerHTML = `<p class="cat-empty">Sem dados de categorias no per\u00edodo.</p>`;
    return;
  }

  categoriesListScreen.innerHTML = listItems
    .map((item) => {
      const icon = categoryGlyph(item.name);
      const tone = toneMap.get(item.name) || { fg: "#2b7fff", bg: "#eaf1ff" };
      const toneColor = tone.fg;
      const chipBg = tone.bg;
      const safeName = escapeHtml(item.name);
      const currAbs = Math.abs(item.currBalance);
      const prevAbs = Math.abs(item.prevBalance);
      const base = Math.max(currAbs, prevAbs, 1);
      const currWidth = Math.max(0, Math.min(100, Math.round((currAbs / base) * 100)));
      const prevWidth = Math.max(0, Math.min(100, Math.round((prevAbs / base) * 100)));
      const currClass = item.currBalance >= 0 ? "pos" : "neg";
      const prevClass = item.prevBalance >= 0 ? "pos" : "neg";
      const encodedName = encodeURIComponent(item.name);
      categoryRowsIndex.set(item.name, { currBalance: item.currBalance, prevBalance: item.prevBalance, toneColor, chipBg });

      return `
        <button type="button" class="cat-row cat-row--button" data-category-name="${encodedName}">
          <div class="cat-row__meta">
            <span class="cat-chip" style="--cat-chip-bg:${chipBg};--cat-chip-fg:${toneColor}"><span class="material-symbols-rounded cat-chip__icon">${icon}</span>${safeName}</span>
          </div>
          <div class="cat-row__curr ${currClass}">${money.format(item.currBalance)}</div>
          <span class="cat-row__bar" style="--cat-tone:${toneColor}">
            <span class="cat-row__bar-fill-prev" style="width:${prevWidth}%"></span>
            <span class="cat-row__bar-fill-curr" style="width:${currWidth}%"></span>
          </span>
          <div class="cat-row__prev ${prevClass}">${money.format(item.prevBalance)}</div>
        </button>
      `;
    })
    .join("");
}

function renderAccountsTab(currentAgg, previousAgg) {
  if (!accountsListScreen) return;

  const currentItems = Array.isArray(currentAgg?.by_account) ? currentAgg.by_account : [];
  const previousItems = Array.isArray(previousAgg?.by_account) ? previousAgg.by_account : [];
  topSummaryState.contas.current = currentItems;
  topSummaryState.contas.previous = previousItems;
  const prevMap = new Map(previousItems.map((item) => [String(item?.name || ""), Number(item?.balance || 0)]));

  const listItems = currentItems
    .map((item) => {
      const name = String(item?.name || "").trim();
      const id = Number(item?.id || 0);
      const type = String(item?.type || "bank");
      const currBalance = Number(item?.balance || 0);
      const prevBalance = Number(prevMap.get(name) || 0);
      const normalizedName = name || "Sem conta/cartão";
      return { id, type, name: normalizedName, currBalance, prevBalance };
    })
    .filter((item) => item.name);

  accountRowsIndex = new Map();
  if (!listItems.length) {
    accountsListScreen.innerHTML = `<p class="cat-empty">Sem dados de contas/cartões no período.</p>`;
    return;
  }

  const toneMap = buildCategoryToneMap([
    ...currentItems.map((item) => String(item?.name || "")),
    ...previousItems.map((item) => String(item?.name || "")),
  ]);

  accountsListScreen.innerHTML = listItems
    .map((item) => {
      const tone = toneMap.get(item.name) || { fg: "#2b7fff", bg: "#eaf1ff" };
      const toneColor = tone.fg;
      const chipBg = tone.bg;
      const icon = item.id <= 0
        ? "account_balance_wallet"
        : (item.type === "card" ? "credit_card" : "account_balance");
      const safeName = escapeHtml(item.name);
      const currAbs = Math.abs(item.currBalance);
      const prevAbs = Math.abs(item.prevBalance);
      const base = Math.max(currAbs, prevAbs, 1);
      const currWidth = Math.max(0, Math.min(100, Math.round((currAbs / base) * 100)));
      const prevWidth = Math.max(0, Math.min(100, Math.round((prevAbs / base) * 100)));
      const currClass = item.currBalance >= 0 ? "pos" : "neg";
      const prevClass = item.prevBalance >= 0 ? "pos" : "neg";

      accountRowsIndex.set(item.id, {
        id: item.id,
        name: item.name,
        type: item.type,
        currBalance: item.currBalance,
        prevBalance: item.prevBalance,
      });

      return `
        <button type="button" class="cat-row cat-row--button" data-account-id="${item.id}">
          <div class="cat-row__meta">
            <span class="cat-chip" style="--cat-chip-bg:${chipBg};--cat-chip-fg:${toneColor}"><span class="material-symbols-rounded cat-chip__icon">${icon}</span>${safeName}</span>
          </div>
          <div class="cat-row__curr ${currClass}">${money.format(item.currBalance)}</div>
          <span class="cat-row__bar" style="--cat-tone:${toneColor}">
            <span class="cat-row__bar-fill-prev" style="width:${prevWidth}%"></span>
            <span class="cat-row__bar-fill-curr" style="width:${currWidth}%"></span>
          </span>
          <div class="cat-row__prev ${prevClass}">${money.format(item.prevBalance)}</div>
        </button>
      `;
    })
    .join("");
}

function recurrenceFrequencyLabel(value) {
  const key = String(value || "").trim().toLowerCase();
  if (key === "daily") return "Diário";
  if (key === "weekly") return "Semanal";
  if (key === "biweekly") return "Quinzenal";
  if (key === "annual") return "Anual";
  return "Mensal";
}

function buildGroupsFromFlatEntries(entries) {
  const yearsMap = new Map();
  const sorted = [...(Array.isArray(entries) ? entries : [])].sort((a, b) => {
    const byDate = String(b?.date || "").localeCompare(String(a?.date || ""));
    if (byDate !== 0) return byDate;
    return String(b?.updated_at || b?.created_at || "").localeCompare(String(a?.updated_at || a?.created_at || ""));
  });

  sorted.forEach((entry) => {
    const iso = String(entry?.date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
    const yearKey = iso.slice(0, 4);
    const monthKey = iso.slice(0, 7);
    const amountRaw = Number(entry?.amount || 0);
    const signed = String(entry?.type || "") === "out" ? -Math.abs(amountRaw) : Math.abs(amountRaw);

    if (!yearsMap.has(yearKey)) {
      yearsMap.set(yearKey, { year: yearKey, total: 0, months: new Map() });
    }
    const yearNode = yearsMap.get(yearKey);
    yearNode.total += signed;

    if (!yearNode.months.has(monthKey)) {
      yearNode.months.set(monthKey, { month: monthKey, total: 0, days: new Map() });
    }
    const monthNode = yearNode.months.get(monthKey);
    monthNode.total += signed;

    if (!monthNode.days.has(iso)) {
      monthNode.days.set(iso, { day: iso, total: 0, entries: [] });
    }
    const dayNode = monthNode.days.get(iso);
    dayNode.total += signed;
    dayNode.entries.push(entry);
  });

  return [...yearsMap.values()]
    .sort((a, b) => String(b.year).localeCompare(String(a.year)))
    .map((yearNode) => ({
      year: yearNode.year,
      label: yearNode.year,
      totals: { balance: Number(yearNode.total || 0) },
      months: [...yearNode.months.values()]
        .sort((a, b) => String(b.month).localeCompare(String(a.month)))
        .map((monthNode) => ({
          month: monthNode.month,
          label: monthLabelFromKey(monthNode.month),
          totals: { balance: Number(monthNode.total || 0) },
          days: [...monthNode.days.values()]
            .sort((a, b) => String(b.day).localeCompare(String(a.day)))
            .map((dayNode) => ({
              day: dayNode.day,
              date: dayNode.day,
              label: dayMonthShortLabel(dayNode.day),
              totals: { balance: Number(dayNode.total || 0) },
              entries: dayNode.entries,
            })),
        })),
    }));
}

function buildGroupsFromRecurrences(items) {
  const yearsMap = new Map();
  const sorted = [...(Array.isArray(items) ? items : [])].sort((a, b) => {
    const byDate = String(b?.next_run_date || "").localeCompare(String(a?.next_run_date || ""));
    if (byDate !== 0) return byDate;
    return String(b?.updated_at || b?.created_at || "").localeCompare(String(a?.updated_at || a?.created_at || ""));
  });

  sorted.forEach((item) => {
    const iso = String(item?.next_run_date || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return;
    const yearKey = iso.slice(0, 4);
    const monthKey = iso.slice(0, 7);
    const amountRaw = Number(item?.amount || 0);
    const signed = String(item?.type || "") === "out" ? -Math.abs(amountRaw) : Math.abs(amountRaw);

    if (!yearsMap.has(yearKey)) {
      yearsMap.set(yearKey, { year: yearKey, total: 0, months: new Map() });
    }
    const yearNode = yearsMap.get(yearKey);
    yearNode.total += signed;

    if (!yearNode.months.has(monthKey)) {
      yearNode.months.set(monthKey, { month: monthKey, total: 0, days: new Map() });
    }
    const monthNode = yearNode.months.get(monthKey);
    monthNode.total += signed;

    if (!monthNode.days.has(iso)) {
      monthNode.days.set(iso, { day: iso, total: 0, entries: [] });
    }
    const dayNode = monthNode.days.get(iso);
    dayNode.total += signed;
    dayNode.entries.push(item);
  });

  return [...yearsMap.values()]
    .sort((a, b) => String(b.year).localeCompare(String(a.year)))
    .map((yearNode) => ({
      year: yearNode.year,
      label: yearNode.year,
      totals: { balance: Number(yearNode.total || 0) },
      months: [...yearNode.months.values()]
        .sort((a, b) => String(b.month).localeCompare(String(a.month)))
        .map((monthNode) => ({
          month: monthNode.month,
          label: monthLabelFromKey(monthNode.month),
          totals: { balance: Number(monthNode.total || 0) },
          days: [...monthNode.days.values()]
            .sort((a, b) => String(b.day).localeCompare(String(a.day)))
            .map((dayNode) => ({
              day: dayNode.day,
              date: dayNode.day,
              label: dayMonthShortLabel(dayNode.day),
              totals: { balance: Number(dayNode.total || 0) },
              entries: dayNode.entries,
            })),
        })),
    }));
}

function renderRecurrenceGroups(container, groups, emptyText) {
  if (!Array.isArray(groups) || groups.length === 0) {
    renderEntriesEmptyState(container, emptyText || "Nenhuma recorrência encontrada.");
    return;
  }

  container.innerHTML = groups
    .map((yearNode) => {
      const months = (Array.isArray(yearNode?.months) ? yearNode.months : [])
        .map((monthNode) => {
          const days = (Array.isArray(monthNode?.days) ? monthNode.days : [])
            .map((dayNode) => {
              const rows = (Array.isArray(dayNode?.entries) ? dayNode.entries : [])
                .map((item) => {
                  const id = Number(item?.id || 0);
                  const amountRaw = Number(item?.amount || 0);
                  const signed = String(item?.type || "") === "out" ? -Math.abs(amountRaw) : Math.abs(amountRaw);
                  const amountClass = toAmountClass(signed);
                  const category = escapeHtml(String(item?.category || "Sem categoria"));
                  const account = escapeHtml(String(item?.account_name || "Sem conta/cartão"));
                  const frequency = escapeHtml(recurrenceFrequencyLabel(item?.frequency));
                  const tone = String(item?.type || "") === "out" ? "entry-chip--out" : "entry-chip--in";
                  return `
                    <button type="button" class="entry-row entry-row--button" data-recurrence-id="${id}" aria-label="Abrir recorrência ${category}">
                      <div class="entry-row__title">${category}</div>
                      <div class="entry-row__chips">
                        <span class="entry-chip ${tone}">${account} • ${frequency}</span>
                      </div>
                      <div class="entry-row__value ${amountClass}">${money.format(signed)}</div>
                    </button>
                  `;
                })
                .join("");
              return `
                <section class="entry-day">
                  <header class="entry-day__head">
                    <div class="entry-group entry-group--day">${escapeHtml(dayNode?.label || dayNode?.day || "")}</div>
                  </header>
                  <div class="entry-cluster__rows">${rows}</div>
                </section>
              `;
            })
            .join("");

          return `
            <section class="entry-month">
              <header class="entry-month__head">
                <div class="entry-month__title">${escapeHtml(monthLabelWithoutYear(String(monthNode?.label || monthNode?.month || ""), String(monthNode?.month || "")))}</div>
              </header>
              ${days}
            </section>
          `;
        })
        .join("");

      return `
        <section class="entry-year">
          <header class="entry-year__head">
            <div class="entry-group entry-group--year">${escapeHtml(yearNode?.label || yearNode?.year || "")}</div>
          </header>
          ${months}
        </section>
      `;
    })
    .join("");
}

function syncRecurrencePickers() {
  if (selectedRecurrenceCategoryEl) {
    selectedRecurrenceCategoryEl.textContent = selectedRecurrenceCategoryValue || "Selecionar categoria";
    selectedRecurrenceCategoryEl.classList.toggle("is-placeholder", !selectedRecurrenceCategoryValue);
  }
  if (selectedRecurrenceAccountEl) {
    const account = accounts.find((item) => Number(item?.id || 0) === Number(selectedRecurrenceAccountId || 0));
    const name = String(account?.name || "");
    selectedRecurrenceAccountEl.textContent = name || "Selecionar conta/cartão";
    selectedRecurrenceAccountEl.classList.toggle("is-placeholder", !name);
  }
  if (selectedRecurrenceDateEl) {
    selectedRecurrenceDateEl.textContent = selectedRecurrenceStartDateISO ? formatIsoDate(selectedRecurrenceStartDateISO) : "Selecionar data";
    selectedRecurrenceDateEl.classList.toggle("is-placeholder", !selectedRecurrenceStartDateISO);
  }
  if (selectedRecurrenceFrequencyEl) {
    selectedRecurrenceFrequencyEl.textContent = recurrenceFrequencyLabel(selectedRecurrenceFrequencyValue);
    selectedRecurrenceFrequencyEl.classList.toggle("is-placeholder", !selectedRecurrenceFrequencyValue);
  }
}

function renderRecurrenceCategoryOptions() {
  if (!recurrenceCategoryListEl) return;
  const query = String(recurrenceCategorySearchInput?.value || "").trim().toLowerCase();
  const searched = categories.filter((item) => String(item?.name || "").toLowerCase().includes(query));
  if (!searched.length) {
    recurrenceCategoryListEl.innerHTML = `<p class="category-empty">Nenhuma categoria encontrada.</p>`;
    return;
  }
  const groups = [
    { key: "in", title: "Entrada", icon: "arrow_downward" },
    { key: "out", title: "Saída", icon: "arrow_upward" },
  ];
  recurrenceCategoryListEl.innerHTML = groups.map((group) => {
    const options = searched.filter((item) => String(item?.type || "") === group.key);
    if (!options.length) return "";
    const optionsHtml = options.map((item) => {
      const label = String(item?.name || "").trim();
      const isSelected = label === selectedRecurrenceCategoryValue;
      return `
        <button type="button" class="category-option is-${group.key}" data-recurrence-category="${encodeURIComponent(label)}"${isSelected ? ' aria-current="true"' : ""}>
          <span class="category-option__lead"><span class="material-symbols-rounded">${group.icon}</span></span>
          <span class="category-option__text">${escapeHtml(label)}</span>
        </button>
      `;
    }).join("");
    return `
      <section class="category-group">
        <h4 class="category-group__title">${group.title}</h4>
        <div class="category-group__items">${optionsHtml}</div>
      </section>
    `;
  }).join("");
}

function renderRecurrenceAccountOptions() {
  if (!recurrenceAccountListEl) return;
  const query = String(recurrenceAccountSearchInput?.value || "").trim().toLowerCase();
  const searched = accounts.filter((item) => String(item?.name || "").toLowerCase().includes(query));
  if (!searched.length) {
    recurrenceAccountListEl.innerHTML = `<p class="category-empty">Nenhuma conta/cartão encontrada.</p>`;
    return;
  }
  const groups = [{ key: "bank" }, { key: "card" }];
  recurrenceAccountListEl.innerHTML = groups.map((group) => {
    const options = searched.filter((item) => String(item?.type || "bank") === group.key);
    if (!options.length) return "";
    const optionsHtml = options.map((item) => {
      const id = Number(item?.id || 0);
      const label = String(item?.name || "").trim();
      const isSelected = selectedRecurrenceAccountId === id;
      return `
        <button type="button" class="category-option is-neutral" data-recurrence-account-id="${id}"${isSelected ? ' aria-current="true"' : ""}>
          <span class="category-option__lead"><span class="material-symbols-rounded">${accountTypeIcon(group.key)}</span></span>
          <span class="category-option__text">${escapeHtml(label)}</span>
        </button>
      `;
    }).join("");
    return `
      <section class="category-group">
        <h4 class="category-group__title">${accountTypeLabel(group.key)}</h4>
        <div class="category-group__items">${optionsHtml}</div>
      </section>
    `;
  }).join("");
}

function renderRecurrenceFrequencyOptions() {
  if (!recurrenceFrequencyListEl) return;
  const options = [
    { value: "daily", label: "Diário", icon: "today" },
    { value: "weekly", label: "Semanal", icon: "date_range" },
    { value: "biweekly", label: "Quinzenal", icon: "calendar_view_week" },
    { value: "monthly", label: "Mensal", icon: "calendar_month" },
    { value: "annual", label: "Anual", icon: "event_repeat" },
  ];
  recurrenceFrequencyListEl.innerHTML = options.map((item) => {
    const isSelected = selectedRecurrenceFrequencyValue === item.value;
    return `
      <button type="button" class="category-option is-neutral" data-recurrence-frequency="${item.value}"${isSelected ? ' aria-current="true"' : ""}>
        <span class="category-option__lead"><span class="material-symbols-rounded">${item.icon}</span></span>
        <span class="category-option__text">${escapeHtml(item.label)}</span>
      </button>
    `;
  }).join("");
}

async function openRecurrenceCategorySheet() {
  await closeRecurrenceAccountSheet();
  await closeRecurrenceDateSheet();
  await closeRecurrenceFrequencySheet();
  renderRecurrenceCategoryOptions();
  await recurrenceCategoryModal?.present();
  setPickerExpanded(openRecurrenceCategoryBtn, true);
  refreshPickerLayerState();
}

async function closeRecurrenceCategorySheet() {
  try { await recurrenceCategoryModal?.dismiss(); } catch {}
  setPickerExpanded(openRecurrenceCategoryBtn, false);
  refreshPickerLayerState();
}

async function openRecurrenceAccountSheet() {
  await closeRecurrenceCategorySheet();
  await closeRecurrenceDateSheet();
  await closeRecurrenceFrequencySheet();
  renderRecurrenceAccountOptions();
  await recurrenceAccountModal?.present();
  setPickerExpanded(openRecurrenceAccountBtn, true);
  refreshPickerLayerState();
}

async function closeRecurrenceAccountSheet() {
  try { await recurrenceAccountModal?.dismiss(); } catch {}
  setPickerExpanded(openRecurrenceAccountBtn, false);
  refreshPickerLayerState();
}

async function openRecurrenceDateSheet() {
  await closeRecurrenceCategorySheet();
  await closeRecurrenceAccountSheet();
  await closeRecurrenceFrequencySheet();
  if (recurrenceDatePicker) recurrenceDatePicker.value = selectedRecurrenceStartDateISO || todayIsoDate();
  await recurrenceDateModal?.present();
  setPickerExpanded(openRecurrenceDateBtn, true);
  refreshPickerLayerState();
}

async function closeRecurrenceDateSheet() {
  try { await recurrenceDateModal?.dismiss(); } catch {}
  setPickerExpanded(openRecurrenceDateBtn, false);
  refreshPickerLayerState();
}

async function openRecurrenceFrequencySheet() {
  await closeRecurrenceCategorySheet();
  await closeRecurrenceAccountSheet();
  await closeRecurrenceDateSheet();
  renderRecurrenceFrequencyOptions();
  await recurrenceFrequencyModal?.present();
  setPickerExpanded(openRecurrenceFrequencyBtn, true);
  refreshPickerLayerState();
}

async function closeRecurrenceFrequencySheet() {
  try { await recurrenceFrequencyModal?.dismiss(); } catch {}
  setPickerExpanded(openRecurrenceFrequencyBtn, false);
  refreshPickerLayerState();
}

function resetRecurrenceForm() {
  editingRecurrenceId = 0;
  if (recurrenceModalTitleEl) recurrenceModalTitleEl.textContent = "Nova recorrência";
  if (recurrenceAmountInput) recurrenceAmountInput.value = formatMoneyInput(0);
  selectedRecurrenceCategoryValue = "";
  selectedRecurrenceAccountId = 0;
  selectedRecurrenceStartDateISO = todayIsoDate();
  selectedRecurrenceFrequencyValue = "monthly";
  if (recurrenceDescriptionInput) recurrenceDescriptionInput.value = "";
  syncRecurrencePickers();
  if (deleteRecurrenceBtn) {
    deleteRecurrenceBtn.hidden = true;
    deleteRecurrenceBtn.style.display = "none";
  }
  recurrenceEditorHistoryToken += 1;
  if (recurrenceEditorHistorySectionEl) recurrenceEditorHistorySectionEl.hidden = true;
  if (recurrenceEditorHistoryListEl) recurrenceEditorHistoryListEl.innerHTML = "";
}

async function openRecurrenceModal() {
  hideMessages();
  await loadCategories();
  await loadAccounts();
  if (!editingRecurrenceId) resetRecurrenceForm();
  await recurrenceModal?.present();
}

async function closeRecurrenceModal() {
  await closeRecurrenceCategorySheet();
  await closeRecurrenceAccountSheet();
  await closeRecurrenceDateSheet();
  await closeRecurrenceFrequencySheet();
  try {
    await recurrenceModal?.dismiss();
  } catch {
    // no-op
  }
}

async function saveRecurrence() {
  const isEditingRecurrence = editingRecurrenceId > 0;
  const amount = parseMoneyInput(recurrenceAmountInput?.value || "");
  const category = String(selectedRecurrenceCategoryValue || "").trim();
  const accountId = Number(selectedRecurrenceAccountId || 0);
  const frequency = String(selectedRecurrenceFrequencyValue || "monthly");
  const startDate = String(selectedRecurrenceStartDateISO || "").slice(0, 10);
  const description = String(recurrenceDescriptionInput?.value || "").trim();
  const categoryType = String(categories.find((item) => String(item?.name || "") === category)?.type || "");

  if (!["in", "out"].includes(categoryType)) {
    showError("Selecione uma categoria válida para recorrência.");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Informe um valor válido.");
    return;
  }
  if (accountId <= 0) {
    showError("Conta/cartão é obrigatória.");
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    showError("Data inicial inválida.");
    return;
  }

  try {
    const endpoint = editingRecurrenceId ? `/api/recurrences/${editingRecurrenceId}` : "/api/recurrences";
    const method = editingRecurrenceId ? "PUT" : "POST";
    const response = await fetch(endpoint, {
      method,
      credentials: "same-origin",
      headers: adminAuthHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        type: categoryType,
        amount,
        category,
        account_id: accountId,
        description,
        frequency,
        start_date: startDate,
      }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível salvar a recorrência."));
      return;
    }
    if (!isEditingRecurrence) {
      pushUserNotification({
        title: "Recorrência criada",
        message: `${category} • ${recurrenceFrequencyLabel(frequency)} • ${money.format(categoryType === "out" ? -Math.abs(amount) : Math.abs(amount))}`,
        source: "recurrence",
      });
    }
    await closeRecurrenceModal();
    showInfo(isEditingRecurrence ? "Recorrência atualizada com sucesso." : "Recorrência criada com sucesso.");
    await loadDashboard();
    showTab("recorrentes");
  } catch {
    showError("Falha de rede ao salvar a recorrência.");
  }
}

async function deleteRecurrence() {
  if (editingRecurrenceId <= 0) return;
  const confirmed = await confirmActionModal({
    header: "Excluir recorrência",
    message: "A recorrência será removida. Os lançamentos já criados permanecem no histórico.",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    confirmRole: "destructive",
  });
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/recurrences/${editingRecurrenceId}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível excluir a recorrência."));
      return;
    }
    await closeRecurrenceModal();
    await closeRecurrenceDetailModal();
    showInfo("Recorrência excluída com sucesso.");
    await loadDashboard();
  } catch {
    showError("Falha de rede ao excluir a recorrência.");
  }
}

function renderRecurrencesTab(items) {
  recurrences = Array.isArray(items) ? items : [];
  topSummaryState.recorrencias.current = recurrences;
  const total = recurrences.length;
  if (recurrenceMetaEl) {
    recurrenceMetaEl.textContent = total === 1 ? "1 recorrência" : `${total} recorrências`;
  }
  if (activeTabName() === "recorrentes") {
    renderTopSummaryForTab("recorrentes");
  }

  if (!recurrencesListScreen) return;
  if (!recurrences.length) {
    recurrencesListScreen.innerHTML = `<p class="cat-empty">Sem recorrências cadastradas.</p>`;
    return;
  }
  const groups = buildGroupsFromRecurrences(recurrences);
  renderRecurrenceGroups(recurrencesListScreen, groups, "Sem recorrências cadastradas.");
}

async function openRecurrenceEditor(recurrenceId) {
  const item = recurrences.find((row) => Number(row?.id || 0) === Number(recurrenceId));
  if (!item) return;
  editingRecurrenceId = Number(item?.id || 0);
  await loadCategories();
  await loadAccounts();
  if (recurrenceModalTitleEl) recurrenceModalTitleEl.textContent = "Editar recorrência";
  if (recurrenceAmountInput) recurrenceAmountInput.value = formatMoneyInput(Number(item?.amount || 0));
  selectedRecurrenceCategoryValue = String(item?.category || "");
  selectedRecurrenceAccountId = Number(item?.account_id || 0);
  selectedRecurrenceStartDateISO = String(item?.start_date || todayIsoDate()).slice(0, 10);
  selectedRecurrenceFrequencyValue = String(item?.frequency || "monthly");
  if (recurrenceDescriptionInput) recurrenceDescriptionInput.value = String(item?.description || "");
  syncRecurrencePickers();
  if (deleteRecurrenceBtn) {
    deleteRecurrenceBtn.hidden = false;
    deleteRecurrenceBtn.style.display = "";
  }
  await recurrenceModal?.present();
  void loadRecurrenceEditorHistory(editingRecurrenceId);
}

async function loadRecurrenceEditorHistory(recurrenceId) {
  const id = Number(recurrenceId || 0);
  if (id <= 0 || !recurrenceEditorHistorySectionEl || !recurrenceEditorHistoryListEl) return;
  const token = ++recurrenceEditorHistoryToken;
  recurrenceEditorHistorySectionEl.hidden = false;
  renderEntriesEmptyState(recurrenceEditorHistoryListEl, "Carregando lançamentos criados...");
  try {
    const response = await authFetch(`/api/recurrences/${id}`);
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      if (token !== recurrenceEditorHistoryToken) return;
      renderEntriesEmptyState(recurrenceEditorHistoryListEl, "Não foi possível carregar os lançamentos criados.");
      return;
    }
    if (token !== recurrenceEditorHistoryToken) return;
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    const groups = buildGroupsFromFlatEntries(entries);
    renderEntriesGroupedFromServer(recurrenceEditorHistoryListEl, groups, "Nenhum lançamento criado por esta recorrência.");
  } catch {
    if (token !== recurrenceEditorHistoryToken) return;
    renderEntriesEmptyState(recurrenceEditorHistoryListEl, "Falha de rede ao carregar lançamentos criados.");
  }
}

async function openRecurrenceDetailModal(recurrenceId) {
  try {
    const response = await authFetch(`/api/recurrences/${recurrenceId}`);
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível carregar a recorrência."));
      return;
    }

    if (recurrenceDetailTitleEl) {
      recurrenceDetailTitleEl.textContent = String(payload?.category || "Recorrência");
    }
    if (recurrenceDetailNextDateEl) {
      recurrenceDetailNextDateEl.textContent = formatIsoDate(String(payload?.next_entry?.date || payload?.next_run_date || ""));
    }
    if (recurrenceDetailNextAmountEl) {
      const value = Number(payload?.next_entry?.amount || payload?.amount || 0);
      const type = String(payload?.next_entry?.type || payload?.type || "");
      const signed = type === "out" ? -Math.abs(value) : Math.abs(value);
      recurrenceDetailNextAmountEl.textContent = money.format(signed);
      recurrenceDetailNextAmountEl.classList.remove("pos", "neg");
      recurrenceDetailNextAmountEl.classList.add(signed >= 0 ? "pos" : "neg");
    }
    if (recurrenceDetailNextMetaEl) {
      const frequency = recurrenceFrequencyLabel(payload?.frequency);
      const account = String(payload?.next_entry?.account_name || payload?.account_name || "Sem conta/cartão");
      recurrenceDetailNextMetaEl.textContent = `${frequency} • ${account}`;
    }
    const entries = Array.isArray(payload?.entries) ? payload.entries : [];
    const groups = buildGroupsFromFlatEntries(entries);
    renderEntriesGroupedFromServer(recurrenceDetailListEl, groups, "Nenhum lançamento criado por esta recorrência.");
    editingRecurrenceId = Number(payload?.id || 0);
    await recurrenceDetailModal?.present();
  } catch {
    showError("Falha de rede ao carregar a recorrência.");
  }
}

async function closeRecurrenceDetailModal() {
  try {
    await recurrenceDetailModal?.dismiss();
  } catch {
    // no-op
  }
}

async function loadRecurrences() {
  try {
    const response = await authFetch("/api/recurrences");
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!response.ok) {
      renderRecurrencesTab([]);
      return;
    }
    const data = await response.json();
    renderRecurrencesTab(Array.isArray(data) ? data : []);
  } catch {
    renderRecurrencesTab([]);
  }
}

function setupRecurrenceInteractions() {
  openRecurrenceInlineBtn?.addEventListener("click", () => {
    editingRecurrenceId = 0;
    resetRecurrenceForm();
    void openRecurrenceModal();
  });
  closeRecurrenceBtn?.addEventListener("click", () => {
    void closeRecurrenceModal();
  });
  cancelRecurrenceBtn?.addEventListener("click", () => {
    void closeRecurrenceModal();
  });
  saveRecurrenceBtn?.addEventListener("click", () => {
    void saveRecurrence();
  });
  deleteRecurrenceBtn?.addEventListener("click", () => {
    void deleteRecurrence();
  });

  openRecurrenceCategoryBtn?.addEventListener("click", () => {
    renderRecurrenceCategoryOptions();
    void openRecurrenceCategorySheet();
  });
  closeRecurrenceCategoryModalBtn?.addEventListener("click", () => {
    void closeRecurrenceCategorySheet();
  });
  recurrenceCategorySearchInput?.addEventListener("ionInput", () => {
    renderRecurrenceCategoryOptions();
  });
  recurrenceCategoryListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-recurrence-category]");
    if (!button) return;
    const encoded = String(button.getAttribute("data-recurrence-category") || "").trim();
    const value = encoded ? decodeURIComponent(encoded) : "";
    if (!value) return;
    selectedRecurrenceCategoryValue = value;
    syncRecurrencePickers();
    void closeRecurrenceCategorySheet();
  });

  openRecurrenceAccountBtn?.addEventListener("click", () => {
    renderRecurrenceAccountOptions();
    void openRecurrenceAccountSheet();
  });
  closeRecurrenceAccountModalBtn?.addEventListener("click", () => {
    void closeRecurrenceAccountSheet();
  });
  recurrenceAccountSearchInput?.addEventListener("ionInput", () => {
    renderRecurrenceAccountOptions();
  });
  recurrenceAccountListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-recurrence-account-id]");
    if (!button) return;
    const accountId = Number(button.getAttribute("data-recurrence-account-id") || 0);
    if (accountId <= 0) return;
    selectedRecurrenceAccountId = accountId;
    syncRecurrencePickers();
    void closeRecurrenceAccountSheet();
  });

  openRecurrenceDateBtn?.addEventListener("click", () => {
    void openRecurrenceDateSheet();
  });
  closeRecurrenceDateModalBtn?.addEventListener("click", () => {
    void closeRecurrenceDateSheet();
  });
  recurrenceDatePicker?.addEventListener("ionChange", (event) => {
    const value = String(event?.detail?.value || "").slice(0, 10);
    if (!value) return;
    selectedRecurrenceStartDateISO = value;
    syncRecurrencePickers();
    void closeRecurrenceDateSheet();
  });

  openRecurrenceFrequencyBtn?.addEventListener("click", () => {
    renderRecurrenceFrequencyOptions();
    void openRecurrenceFrequencySheet();
  });
  closeRecurrenceFrequencyModalBtn?.addEventListener("click", () => {
    void closeRecurrenceFrequencySheet();
  });
  recurrenceFrequencyListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-recurrence-frequency]");
    if (!button) return;
    const value = String(button.getAttribute("data-recurrence-frequency") || "").trim();
    if (!value) return;
    selectedRecurrenceFrequencyValue = value;
    syncRecurrencePickers();
    void closeRecurrenceFrequencySheet();
  });

  recurrenceAmountInput?.addEventListener("ionInput", (event) => {
    const value = parseMoneyInput(event?.detail?.value || recurrenceAmountInput.value || "");
    recurrenceAmountInput.value = formatMoneyInput(value);
  });
  recurrencesListScreen?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-recurrence-id]");
    if (!button) return;
    const recurrenceId = Number(button.getAttribute("data-recurrence-id") || 0);
    if (recurrenceId > 0) {
      void openRecurrenceEditor(recurrenceId);
    }
  });
  closeRecurrenceDetailBtn?.addEventListener("click", () => {
    void closeRecurrenceDetailModal();
  });
  editRecurrenceFromDetailBtn?.addEventListener("click", () => {
    if (editingRecurrenceId > 0) {
      void closeRecurrenceDetailModal().then(() => openRecurrenceEditor(editingRecurrenceId));
    }
  });

  recurrenceCategoryModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openRecurrenceCategoryBtn, false);
    refreshPickerLayerState();
  });
  recurrenceCategoryModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });
  recurrenceAccountModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openRecurrenceAccountBtn, false);
    refreshPickerLayerState();
  });
  recurrenceAccountModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });
  recurrenceDateModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openRecurrenceDateBtn, false);
    refreshPickerLayerState();
  });
  recurrenceDateModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });
  recurrenceFrequencyModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openRecurrenceFrequencyBtn, false);
    refreshPickerLayerState();
  });
  recurrenceFrequencyModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });
}

async function loadCategories() {
  try {
    const response = await authFetch("/api/categories");
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!response.ok) {
      categories = [];
      renderCategoryOptions("");
      syncRecurrencePickers();
      return;
    }
    const data = await response.json();
    categories = Array.isArray(data) ? data : [];
    if (!entryFilters.categories.length) {
      entryFilters.categories = categories.map((item) => String(item?.name || ""));
      draftEntryFilters.categories = [...entryFilters.categories];
      formatFilterPanel();
    }
    renderCategoryOptions("");
    syncUserCategorySelections();
    syncRecurrencePickers();
  } catch {
    categories = [];
    renderCategoryOptions("");
    syncUserCategorySelections();
    syncRecurrencePickers();
  }
}

async function uploadAttachment(file) {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    credentials: "same-origin",
    headers: authHeaders(),
    body: formData,
  });

  if (response.status === 401) {
    window.location.href = "/";
    return null;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || !data?.file) {
    throw new Error(data?.error || "N\u00e3o foi poss\u00edvel enviar o comprovante.");
  }

  return String(data.file);
}

function resetEntryForm() {
  if (entryTypeInput) entryTypeInput.value = "";
  editingEntryId = null;
  editingEntryUserId = 0;
  editingEntryAttachmentPath = "";
  editingEntryDeleted = false;
  editingEntryPending = false;
  editingEntryTypeFallback = "";
  setEntryModalMode("create");
  setEntryTheme("neutral");
  if (entryAmountInput) entryAmountInput.value = formatMoneyInput(0);
  selectedCategoryValue = "";
  if (categorySearchInput) categorySearchInput.value = "";
  if (selectedCategoryEl) {
    selectedCategoryEl.textContent = "Selecionar categoria";
    selectedCategoryEl.classList.add("is-placeholder");
  }
  selectedAccountId = 0;
  if (accountSearchInput) accountSearchInput.value = "";
  if (selectedAccountEl) {
    selectedAccountEl.textContent = "Selecionar conta/cartão";
    selectedAccountEl.classList.add("is-placeholder");
  }
  setEntryDirectionHint("");
  setPickerExpanded(openCategoryBtn, false);
  setPickerExpanded(openAccountBtn, false);
  if (entryDescriptionInput) entryDescriptionInput.value = "";
  selectedDateISO = todayIsoDate();
  if (datePicker) datePicker.value = selectedDateISO;
  if (selectedDateEl) {
    selectedDateEl.textContent = formatIsoDate(selectedDateISO);
    selectedDateEl.classList.remove("is-placeholder");
  }
  setPickerExpanded(openDateBtn, false);
  renderCategoryOptions("");
  renderAccountOptions();
  clearAttachmentSelection();
  selectedEntryRecurrenceFrequency = "";
  syncEntryRecurrenceSelection();
  updateSaveState();
}

async function openEntryModal() {
  hideMessages();
  resetEntryForm();
  await loadCategories();
  await loadAccounts();
  setEntryModalMode("create");
  await entryModal?.present();
  setEntryLayerState(true);
}

async function closeEntryModal() {
  await closeAttachmentViewer();
  await closeCategorySheet();
  await closeAccountSheet();
  await closeDateSheet();
  await closeEntryRecurrenceSheet();
  await entryModal?.dismiss();
  setEntryLayerState(false);
  refreshPickerLayerState();
}

async function createEntry() {
  const type = currentEntryTypeForValidation();
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const accountId = Number(selectedAccountId || 0);
  const date = String(selectedDateISO || "").slice(0, 10).trim();
  const description = String(entryDescriptionInput?.value || "").trim();
  const recurrenceFrequency = String(selectedEntryRecurrenceFrequency || "");

  if (!["in", "out"].includes(type)) {
    showError("Selecione uma categoria v\u00e1lida.");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Informe um valor v\u00e1lido.");
    return;
  }
  if (!category) {
    showError("Categoria \u00e9 obrigat\u00f3ria.");
    return;
  }
  if (accountId <= 0) {
    showError("Conta/cartão é obrigatória.");
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    showError("Data inv\u00e1lida.");
    return;
  }

  savingEntry = true;
  setSaveButtonVisualState("saving");
  try {
    const attachmentPath = selectedAttachmentFile
      ? await uploadAttachment(selectedAttachmentFile)
      : (editingEntryId ? editingEntryAttachmentPath : null);

    const endpoint = editingEntryId ? `/api/entries/${editingEntryId}` : "/api/entries";
    const response = await fetch(endpoint, {
      method: editingEntryId ? "PUT" : "POST",
      credentials: "same-origin",
      headers: authHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        type,
        amount,
        category,
        account_id: accountId,
        date,
        description,
        attachment_path: attachmentPath,
        recurrence_frequency: recurrenceFrequency,
      }),
    });

    if (response.status === 401) {
      window.location.href = "/";
      return;
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      showError(data?.error || "N\u00e3o foi poss\u00edvel salvar a entrada.");
      return;
    }

    await closeEntryModal();
    showInfo(editingEntryId ? "Lan\u00e7amento atualizado com sucesso." : "Entrada adicionada com sucesso.");
    await loadDashboard();
    showTab("lancamentos");
  } catch {
    showError("Falha de rede ao salvar a entrada.");
  } finally {
    savingEntry = false;
    updateSaveState();
  }
}

async function approvePendingEntry() {
  if (!editingEntryId) return;
  if (!canApprovePendingEntry()) {
    showError("Aprovação disponível apenas para administrador.");
    return;
  }
  const type = currentEntryTypeForValidation();
  const amount = parseMoneyInput(entryAmountInput?.value || "");
  const category = String(selectedCategoryValue || "").trim();
  const accountId = Number(selectedAccountId || 0);
  const date = String(selectedDateISO || "").slice(0, 10).trim();
  const description = String(entryDescriptionInput?.value || "").trim();

  if (!["in", "out"].includes(type)) {
    showError("Selecione uma categoria válida antes de aprovar.");
    return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    showError("Informe um valor válido antes de aprovar.");
    return;
  }
  if (!category) {
    showError("Categoria é obrigatória para aprovar.");
    return;
  }
  if (accountId <= 0) {
    showError("Conta/cartão é obrigatória para aprovar.");
    return;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    showError("Data inválida para aprovar.");
    return;
  }

  savingEntry = true;
  setSaveButtonVisualState("saving");
  try {
    const usingImpersonationAdminToken = Boolean(
      Boolean(currentProfile?.impersonation?.active)
      && String(currentProfile?.role || "") !== "admin"
    );
    const adminToken = usingImpersonationAdminToken ? getImpersonationAdminToken() : "";
    if (usingImpersonationAdminToken && !adminToken) {
      showError("Token do administrador não encontrado para aprovar em personificação.");
      return;
    }
    const headers = usingImpersonationAdminToken
      ? {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${adminToken}`,
          "X-Auth-Token": adminToken,
        }
      : authHeaders({
          "Content-Type": "application/json",
          Accept: "application/json",
        });

    const attachmentPath = selectedAttachmentFile
      ? await uploadAttachment(selectedAttachmentFile)
      : editingEntryAttachmentPath;

    const response = await fetch(`/api/admin/entries/${editingEntryId}`, {
      method: "PUT",
      credentials: "same-origin",
      headers,
      body: JSON.stringify({
        user_id: Number(editingEntryUserId || 0),
        type,
        amount,
        category,
        account_id: accountId,
        date,
        description,
        attachment_path: attachmentPath || null,
      }),
    });

    if (response.status === 401) {
      window.location.href = "/";
      return;
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      showError(data?.error || "N\u00e3o foi poss\u00edvel aprovar o lançamento.");
      return;
    }

    await closeEntryModal();
    showInfo("Lan\u00e7amento aprovado com sucesso.");
    await loadDashboard();
    showTab("lancamentos");
  } catch {
    showError("Falha de rede ao aprovar o lan\u00e7amento.");
  } finally {
    savingEntry = false;
    updateSaveState();
  }
}

async function restoreEntry() {
  if (!editingEntryId) return;
  try {
    const response = await fetch(`/api/entries/${editingEntryId}/restore`, {
      method: "PUT",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!response.ok) {
      showError("N\u00e3o foi poss\u00edvel restaurar o lan\u00e7amento.");
      return;
    }
    await closeEntryModal();
    showInfo("Lan\u00e7amento restaurado com sucesso.");
    await loadDashboard();
  } catch {
    showError("Falha de rede ao restaurar o lan\u00e7amento.");
  }
}

async function deleteEntry() {
  if (!editingEntryId || editingEntryDeleted) return;
  const confirmed = await confirmActionModal({
    header: "Excluir lançamento",
    message: "Este lançamento será movido para excluídos e poderá ser restaurado depois.",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    confirmRole: "destructive",
  });
  if (!confirmed) return;

  try {
    const response = await fetch(`/api/entries/${editingEntryId}`, {
      method: "DELETE",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!response.ok) {
      showError("N\u00e3o foi poss\u00edvel excluir o lan\u00e7amento.");
      return;
    }
    await closeEntryModal();
    showInfo("Lan\u00e7amento exclu\u00eddo com sucesso.");
    await loadDashboard();
  } catch {
    showError("Falha de rede ao excluir o lan\u00e7amento.");
  }
}

function setupEntryModal() {
  openEntryBtn?.addEventListener("click", () => {
    void openEntryModal();
  });

  openEntryInlineBtn?.addEventListener("click", () => {
    void openEntryModal();
  });

  closeEntryBtn?.addEventListener("click", () => {
    void closeEntryModal();
  });

  cancelEntryBtn?.addEventListener("click", () => {
    void closeEntryModal();
  });

  saveEntryBtn?.addEventListener("click", () => {
    const isAdminPending = Boolean(
      editingEntryId
      && editingEntryPending
      && !editingEntryDeleted
      && canApprovePendingEntry()
    );
    if (isAdminPending) {
      void approvePendingEntry();
      return;
    }
    void createEntry();
  });

  restoreEntryBtn?.addEventListener("click", () => {
    void restoreEntry();
  });

  deleteEntryBtn?.addEventListener("click", () => {
    void deleteEntry();
  });

  entryTypeInput?.addEventListener("ionChange", () => {
    // Mantido por compatibilidade: tipo agora deriva da categoria.
    updateSaveState();
  });

  entryAmountInput?.addEventListener("ionInput", (event) => {
    renderAmountInput(event?.detail?.value || "");
    updateSaveState();
  });

  openEntryRecurrenceBtn?.addEventListener("click", () => {
    void openEntryRecurrenceSheet();
  });

  closeEntryRecurrenceModalBtn?.addEventListener("click", () => {
    void closeEntryRecurrenceSheet();
  });

  entryRecurrenceListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-entry-recurrence]");
    if (!button) return;
    const encoded = String(button.getAttribute("data-entry-recurrence") || "").trim();
    selectedEntryRecurrenceFrequency = encoded ? decodeURIComponent(encoded) : "";
    syncEntryRecurrenceSelection();
    renderEntryRecurrenceOptions();
    void closeEntryRecurrenceSheet();
  });

  openDateBtn?.addEventListener("click", () => {
    void openDateSheet();
  });

  datePicker?.addEventListener("ionChange", (event) => {
    const value = String(event?.detail?.value || "").slice(0, 10);
    if (!value) return;
    selectedDateISO = value;
    if (selectedDateEl) {
      selectedDateEl.textContent = formatIsoDate(value);
      selectedDateEl.classList.remove("is-placeholder");
    }
    void closeDateSheet();
    updateSaveState();
  });

  openCategoryBtn?.addEventListener("click", () => {
    renderCategoryOptions("");
    void openCategorySheet();
  });

  categorySearchInput?.addEventListener("ionInput", () => {
    const current = String(categorySearchInput?.value || "").trim();
    if (current !== selectedCategoryValue) {
      selectedCategoryValue = "";
      if (selectedCategoryEl) {
        selectedCategoryEl.textContent = "Selecionar categoria";
        selectedCategoryEl.classList.add("is-placeholder");
      }
      updateSaveState();
    }
    renderCategoryOptions("");
  });

  categoryListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest(".category-option");
    if (!button) return;
    const encoded = String(button.getAttribute("data-category") || "").trim();
    const value = encoded ? decodeURIComponent(encoded) : "";
    if (!value) return;
    selectedCategoryValue = value;
    if (categorySearchInput) categorySearchInput.value = value;
    if (selectedCategoryEl) {
      selectedCategoryEl.textContent = value;
      selectedCategoryEl.classList.remove("is-placeholder");
    }
    setEntryDirectionHint(value);
    setEntryTheme(entryTypeFromSelectedCategory() || "neutral");
    updateSaveState();
    void closeCategorySheet();
  });

  closeCategoryModalBtn?.addEventListener("click", () => {
    void closeCategorySheet();
  });

  openAccountBtn?.addEventListener("click", () => {
    renderAccountOptions();
    void openAccountSheet();
  });

  accountSearchInput?.addEventListener("ionInput", () => {
    const typed = String(accountSearchInput?.value || "").trim();
    const selected = accounts.find((item) => Number(item?.id || 0) === Number(selectedAccountId || 0));
    if (selected && typed && typed !== String(selected?.name || "")) {
      selectedAccountId = 0;
      if (selectedAccountEl) {
        selectedAccountEl.textContent = "Selecionar conta/cartão";
        selectedAccountEl.classList.add("is-placeholder");
      }
      updateSaveState();
    }
    renderAccountOptions();
  });

  accountListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-account-id]");
    if (!button) return;
    const accountId = Number(button.getAttribute("data-account-id") || 0);
    if (accountId <= 0) return;
    const account = accounts.find((item) => Number(item?.id || 0) === accountId);
    if (!account) return;
    selectedAccountId = accountId;
    if (accountSearchInput) accountSearchInput.value = String(account?.name || "");
    if (selectedAccountEl) {
      selectedAccountEl.textContent = String(account?.name || "");
      selectedAccountEl.classList.remove("is-placeholder");
    }
    updateSaveState();
    void closeAccountSheet();
  });

  closeAccountModalBtn?.addEventListener("click", () => {
    void closeAccountSheet();
  });

  openUserCategoryModalBtn?.addEventListener("click", () => {
    void openUserCategoryModal();
  });

  openUserAccountModalBtn?.addEventListener("click", () => {
    void openUserAccountModal();
  });

  closeUserCategoryModalBtn?.addEventListener("click", () => {
    void closeUserCategoryModal();
  });

  cancelUserCategoryBtn?.addEventListener("click", () => {
    void closeUserCategoryModal();
  });

  closeUserAccountModalBtn?.addEventListener("click", () => {
    void closeUserAccountModal();
  });

  cancelUserAccountBtn?.addEventListener("click", () => {
    void closeUserAccountModal();
  });

  saveUserCategoryBtn?.addEventListener("click", () => {
    void createUserCategory();
  });

  userCategoryNameInput?.addEventListener("ionInput", () => {
    updateUserCategorySaveState();
  });

  saveUserAccountBtn?.addEventListener("click", () => {
    void saveUserAccount();
  });

  userAccountNameInput?.addEventListener("ionInput", () => {
    updateUserAccountSaveState();
  });

  userAccountInitialBalanceInput?.addEventListener("ionInput", (event) => {
    const raw = event?.detail?.value ?? userAccountInitialBalanceInput.value ?? "";
    const value = parseMoneyInput(String(raw));
    if (userAccountInitialBalanceInput) {
      userAccountInitialBalanceInput.value = formatMoneyInput(Number.isFinite(value) ? value : 0);
    }
  });

  userAccountTypeInput?.addEventListener("ionChange", () => {
    updateUserAccountSaveState();
  });

  openUserCategoryIconModalBtn?.addEventListener("click", () => {
    void openUserCategoryIconModal();
  });

  closeUserCategoryIconModalBtn?.addEventListener("click", () => {
    void closeUserCategoryIconModal();
  });

  openUserAccountIconModalBtn?.addEventListener("click", () => {
    void openUserAccountIconModal();
  });

  closeUserAccountIconModalBtn?.addEventListener("click", () => {
    void closeUserAccountIconModal();
  });

  userCategoryIconListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-user-category-icon]");
    if (!button) return;
    const encoded = String(button.getAttribute("data-user-category-icon") || "").trim();
    const iconName = encoded ? decodeURIComponent(encoded) : "";
    if (!iconName) return;
    selectedUserCategoryIcon = iconName;
    syncUserCategorySelections();
    renderUserCategoryIconOptions();
    void closeUserCategoryIconModal();
  });

  userAccountIconListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-user-account-icon]");
    if (!button) return;
    const encoded = String(button.getAttribute("data-user-account-icon") || "").trim();
    const iconName = encoded ? decodeURIComponent(encoded) : "";
    if (!iconName) return;
    selectedUserAccountIcon = iconName;
    syncUserAccountSelections();
    renderUserAccountIconOptions();
    void closeUserAccountIconModal();
  });

  openUserCategoryGlobalModalBtn?.addEventListener("click", () => {
    void openUserCategoryGlobalModal();
  });

  closeUserCategoryGlobalModalBtn?.addEventListener("click", () => {
    void closeUserCategoryGlobalModal();
  });

  userCategoryGlobalSearchInput?.addEventListener("ionInput", () => {
    renderUserCategoryGlobalOptions();
  });

  userCategoryGlobalListEl?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-user-category-global]");
    if (!button) return;
    const id = Number(button.getAttribute("data-user-category-global") || 0);
    if (id <= 0) return;
    selectedUserCategoryGlobalId = id;
    syncUserCategorySelections();
    renderUserCategoryGlobalOptions();
    void closeUserCategoryGlobalModal();
  });

  closeDateModalBtn?.addEventListener("click", () => {
    void closeDateSheet();
  });

  categoryModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openCategoryBtn, false);
    refreshPickerLayerState();
  });

  categoryModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });

  userAccountModal?.addEventListener("ionModalDidDismiss", () => {
    refreshPickerLayerState();
  });

  userAccountModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });

  accountModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openAccountBtn, false);
    refreshPickerLayerState();
  });

  accountModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });

  dateModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openDateBtn, false);
    refreshPickerLayerState();
  });

  dateModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });

  entryRecurrenceModal?.addEventListener("ionModalDidDismiss", () => {
    setPickerExpanded(openEntryRecurrenceBtn, false);
    refreshPickerLayerState();
  });

  entryRecurrenceModal?.addEventListener("ionModalDidPresent", () => {
    refreshPickerLayerState();
  });

  entryModal?.addEventListener("ionModalDidDismiss", () => {
    setEntryLayerState(false);
    refreshPickerLayerState();
  });

  openAttachmentBtn?.addEventListener("click", () => {
    attachmentInput?.click();
  });

  attachmentInput?.addEventListener("change", () => {
    const file = attachmentInput.files?.[0] || null;
    if (!file) {
      clearAttachmentSelection();
      return;
    }

    const type = String(file.type || "").toLowerCase();
    const isImage = type.startsWith("image/");
    const isPdf = type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isImage && !isPdf) {
      clearAttachmentSelection();
      showError("Anexe um arquivo de imagem ou PDF.");
      return;
    }
    const maxSize = isPdf ? 1 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      clearAttachmentSelection();
      showError(isPdf ? "Arquivo PDF muito grande. Limite de 1MB." : "Arquivo muito grande. Limite de 10MB.");
      return;
    }

    selectedAttachmentFile = file;
    setAttachmentPreview(file);
  });

  clearAttachmentBtn?.addEventListener("click", () => {
    clearAttachmentSelection(true);
  });

  closeAttachmentViewerBtn?.addEventListener("click", () => {
    void closeAttachmentViewer();
  });

  attachmentViewerModal?.addEventListener("ionModalDidDismiss", () => {
    if (attachmentViewerImage) {
      attachmentViewerImage.hidden = true;
      attachmentViewerImage.removeAttribute("src");
    }
    if (attachmentViewerPdf) {
      attachmentViewerPdf.hidden = true;
      attachmentViewerPdf.removeAttribute("src");
    }
  });

  attachmentPreviewImage?.addEventListener("click", () => {
    if (attachmentPreviewImage.hidden) return;
    const src = String(attachmentPreviewImage.getAttribute("src") || "");
    if (!src) return;
    void openAttachmentViewer(src, false);
  });

  attachmentPreviewPdf?.addEventListener("click", () => {
    if (attachmentPreviewPdf.hidden) return;
    const src = String(attachmentPreviewPdf.getAttribute("src") || "");
    if (!src) return;
    void openAttachmentViewer(src, true);
  });
}
async function authFetch(path) {
  return fetch(path, {
    method: "GET",
    credentials: "same-origin",
    headers: authHeaders({ Accept: "application/json" }, { path }),
  });
}

async function safeJson(response, fallback) {
  try {
    return await response.json();
  } catch {
    return fallback;
  }
}

function readUserNotifications() {
  try {
    const raw = localStorage.getItem(USER_NOTIFICATIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        id: String(item?.id || ""),
        title: String(item?.title || ""),
        message: String(item?.message || ""),
        source: String(item?.source || "system"),
        created_at: String(item?.created_at || ""),
      }))
      .filter((item) => item.id && item.title && item.created_at)
      .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  } catch {
    return [];
  }
}

function writeUserNotifications(items) {
  try {
    const safeList = (Array.isArray(items) ? items : []).slice(0, 80);
    localStorage.setItem(USER_NOTIFICATIONS_KEY, JSON.stringify(safeList));
  } catch {
    // ignore storage errors
  }
}

function pushUserNotification({ title, message = "", source = "system" }) {
  const now = new Date().toISOString();
  const list = readUserNotifications();
  list.unshift({
    id: `${source}-${now}-${Math.round(Math.random() * 1000)}`,
    title: String(title || "Notificação"),
    message: String(message || ""),
    source: String(source || "system"),
    created_at: now,
  });
  writeUserNotifications(list);
}

function setSupportAndNotificationBadges(count) {
  const safeCount = Math.max(0, Number(count || 0));
  const text = safeCount > 99 ? "99+" : String(safeCount);
  if (supportTopBadgeEl) {
    supportTopBadgeEl.hidden = safeCount <= 0;
    supportTopBadgeEl.textContent = text;
  }
  if (notificationsMenuBadgeEl) {
    notificationsMenuBadgeEl.hidden = safeCount <= 0;
    notificationsMenuBadgeEl.textContent = text;
  }
}

function renderNotifications(items) {
  if (!notificationsListEl) return;
  const rows = Array.isArray(items) ? items : [];
  notificationsCache = rows;
  if (!rows.length) {
    notificationsListEl.innerHTML = `
      <div class="settings-empty">
        <p class="settings-empty__title">Sem notificações</p>
        <p class="settings-empty__text">Novidades de recorrências e mensagens aparecerão aqui.</p>
      </div>
    `;
    return;
  }
  notificationsListEl.innerHTML = rows
    .map((item, index) => {
      const title = escapeHtml(String(item?.title || "Notificação"));
      const message = escapeHtml(String(item?.message || ""));
      const source = escapeHtml(String(item?.source || "sistema"));
      const dateText = escapeHtml(formatIsoDate(String(item?.created_at || "").slice(0, 10)) || "--");
      return `
        <button type="button" class="settings-item settings-item--action" data-notification-index="${index}">
          <div class="settings-item__head">
            <h4 class="settings-item__title">${title}</h4>
            <span class="settings-item__date">${dateText}</span>
          </div>
          ${message ? `<p class="settings-item__text">${message}</p>` : ""}
          <p class="settings-item__meta">${source}</p>
        </button>
      `;
    })
    .join("");
}

async function loadNotifications() {
  const localItems = readUserNotifications();
  try {
    const supportEndpoint = isSupportAdminMode() ? "/api/admin/support/threads" : "/api/support/threads";
    const response = await authFetch(supportEndpoint);
    if (response.status === 401) {
      window.location.href = "/";
      return [];
    }
    if (!response.ok) {
      setSupportAndNotificationBadges(0);
      return localItems;
    }
    const payload = await safeJson(response, {});
    const threads = Array.isArray(payload?.threads) ? payload.threads : [];
    const unreadTotal = threads.reduce((acc, thread) => acc + Number(thread?.unread_count || 0), 0);
    setSupportAndNotificationBadges(unreadTotal);
    const counterpartRole = isSupportAdminMode() ? "user" : "admin";
    const supportItems = threads
      .filter((thread) => Number(thread?.unread_count || 0) > 0 || String(thread?.last_sender_role || "") === counterpartRole)
      .map((thread) => {
        const createdAt = String(thread?.last_at || thread?.updated_at || thread?.created_at || "");
        return {
          id: `support-${thread?.id || createdAt}`,
          title: "Mensagem do contador",
          message: String(thread?.last_message || thread?.subject || "Você recebeu uma nova mensagem."),
          source: "suporte",
          created_at: createdAt || new Date().toISOString(),
          action: {
            type: "support",
            thread_id: Number(thread?.id || 0),
            ref_type: String(thread?.last_attachment_ref_type || ""),
            ref_id: Number(thread?.last_attachment_ref_id || 0),
          },
        };
      });
    const merged = [...supportItems, ...localItems].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    return merged.slice(0, 80);
  } catch {
    setSupportAndNotificationBadges(0);
    return localItems;
  }
}

function hydrateProfileForm() {
  if (profileNameInput) profileNameInput.value = String(currentProfile?.name || "");
  if (profileEmailInput) profileEmailInput.value = String(currentProfile?.email || "");
}

function resetPasswordForm() {
  if (passwordCurrentInput) passwordCurrentInput.value = "";
  if (passwordNextInput) passwordNextInput.value = "";
  if (passwordConfirmInput) passwordConfirmInput.value = "";
}

async function openNotificationsModal() {
  const items = await loadNotifications();
  renderNotifications(items);
  await notificationsModal?.present();
}

async function closeNotificationsModal() {
  try {
    await notificationsModal?.dismiss();
  } catch {
    // no-op
  }
}

async function handleNotificationSelection(item) {
  const actionType = String(item?.action?.type || "");
  if (actionType === "support") {
    const threadId = Number(item?.action?.thread_id || 0);
    const refType = String(item?.action?.ref_type || "");
    const refId = Number(item?.action?.ref_id || 0);
    await closeNotificationsModal();
    await openSupportModal({
      threadId,
      focusRefType: refType,
      focusRefId: refId,
    });
    return;
  }
  await closeNotificationsModal();
}

function isSupportAdminMode() {
  return String(currentProfile?.role || "") === "admin" && !Boolean(currentProfile?.impersonation?.active);
}

function supportCurrentThread() {
  return supportThreadsCache.find((item) => Number(item?.id || 0) === Number(selectedSupportThreadId || 0)) || null;
}

function formatSupportTime(value) {
  const raw = String(value || "").trim();
  if (!raw) return "--:--";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatSupportThreadLabel(thread) {
  const subject = String(thread?.subject || "").trim();
  const userName = String(thread?.user_name || thread?.user_email || "").trim();
  if (isSupportAdminMode()) {
    if (subject && userName) return `${userName} · ${subject}`;
    return userName || subject || "Conversa";
  }
  return subject || "Atendimento";
}

function syncSupportThreadLabel() {
  if (!selectedSupportThreadEl) return;
  const current = supportCurrentThread();
  if (!current) {
    selectedSupportThreadEl.textContent = "Selecionar conversa";
    selectedSupportThreadEl.classList.add("is-placeholder");
    return;
  }
  selectedSupportThreadEl.textContent = formatSupportThreadLabel(current);
  selectedSupportThreadEl.classList.remove("is-placeholder");
}

function syncSupportAttachmentPreview() {
  if (!supportAttachmentPreviewEl || !supportAttachmentTitleEl) return;
  if (!supportAttachmentDraft) {
    supportAttachmentPreviewEl.hidden = true;
    supportAttachmentTitleEl.textContent = "";
    return;
  }
  const title = String(supportAttachmentDraft?.title || "").trim() || "Anexo";
  supportAttachmentTitleEl.textContent = title;
  supportAttachmentPreviewEl.hidden = false;
}

function clearSupportAttachmentDraft() {
  supportAttachmentDraft = null;
  if (supportAttachmentFileInput) {
    supportAttachmentFileInput.value = "";
  }
  syncSupportAttachmentPreview();
}

function formatDurationSeconds(totalSeconds) {
  const safe = Math.max(0, Number(totalSeconds || 0));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function stopSupportRecordingIndicator() {
  if (supportRecordingTimer) {
    window.clearInterval(supportRecordingTimer);
    supportRecordingTimer = null;
  }
  if (supportRecordingIndicatorEl) {
    supportRecordingIndicatorEl.hidden = true;
    supportRecordingIndicatorEl.textContent = "00:00";
  }
}

function startSupportRecordingIndicator(startedAtMs) {
  if (!supportRecordingIndicatorEl) return;
  const render = () => {
    const elapsed = Math.max(0, Math.floor((Date.now() - startedAtMs) / 1000));
    supportRecordingIndicatorEl.textContent = formatDurationSeconds(elapsed);
    supportRecordingIndicatorEl.hidden = false;
  };
  render();
  if (supportRecordingTimer) {
    window.clearInterval(supportRecordingTimer);
  }
  supportRecordingTimer = window.setInterval(render, 1000);
}

async function fetchSupportThreads() {
  const endpoint = isSupportAdminMode() ? "/api/admin/support/threads" : "/api/support/threads";
  const response = await authFetch(endpoint);
  if (response.status === 401) {
    window.location.href = "/";
    return [];
  }
  if (!response.ok) {
    const payload = await safeJson(response, {});
    showError(String(payload?.error || "Não foi possível carregar conversas."));
    return [];
  }
  const payload = await safeJson(response, {});
  return Array.isArray(payload?.threads) ? payload.threads : [];
}

async function ensureSupportThreadForUser() {
  if (isSupportAdminMode()) return;
  if (supportThreadsCache.length > 0) return;
  const response = await fetch("/api/support/threads", {
    method: "POST",
    credentials: "same-origin",
    headers: authHeaders({
      "Content-Type": "application/json",
      Accept: "application/json",
    }),
    body: JSON.stringify({ subject: "Atendimento" }),
  });
  if (!response.ok && response.status !== 409) {
    const payload = await safeJson(response, {});
    showError(String(payload?.error || "Não foi possível iniciar atendimento."));
  }
}

function renderSupportThreadList() {
  if (!supportThreadListEl) return;
  if (!supportThreadsCache.length) {
    supportThreadListEl.innerHTML = `<p class="category-empty">Nenhuma conversa encontrada.</p>`;
    return;
  }
  supportThreadListEl.innerHTML = supportThreadsCache.map((thread) => {
    const id = Number(thread?.id || 0);
    const selected = id > 0 && id === Number(selectedSupportThreadId || 0);
    const unread = Number(thread?.unread_count || 0);
    const lastText = String(thread?.last_message || "").trim();
    const when = formatSupportTime(String(thread?.last_at || thread?.updated_at || thread?.created_at || ""));
    return `
      <button type="button" class="category-option category-option--text-meta is-neutral" data-support-thread-id="${id}"${selected ? ' aria-current="true"' : ""}>
        <span class="category-option__text-wrap">
          <span class="category-option__text">${escapeHtml(formatSupportThreadLabel(thread))}</span>
          <span class="category-option__meta">${escapeHtml(lastText || "Sem mensagens")} · ${escapeHtml(when)}</span>
        </span>
        ${unread > 0 ? `<span class="admin-action-badge">${unread}</span>` : ""}
      </button>
    `;
  }).join("");
}

async function fetchSupportMessages(threadId) {
  const endpoint = isSupportAdminMode()
    ? `/api/admin/support/messages?thread_id=${encodeURIComponent(String(threadId))}`
    : `/api/support/messages?thread_id=${encodeURIComponent(String(threadId))}`;
  const response = await authFetch(endpoint);
  if (response.status === 401) {
    window.location.href = "/";
    return [];
  }
  if (!response.ok) {
    const payload = await safeJson(response, {});
    showError(String(payload?.error || "Não foi possível carregar mensagens."));
    return [];
  }
  const payload = await safeJson(response, {});
  return Array.isArray(payload?.messages) ? payload.messages : [];
}

function supportMessageAttachmentHtml(item) {
  const type = String(item?.attachment_type || "").trim();
  const path = String(item?.attachment_path || "").trim();
  const refType = String(item?.attachment_ref_type || "").trim();
  const refId = Number(item?.attachment_ref_id || 0);
  const title = String(item?.attachment_title || "").trim();
  if (!type && !path && (!refType || refId <= 0)) return "";

  if (type === "audio" && path) {
    const src = `/uploads/${encodeURI(path)}`;
    return `
      <div class="support-msg__attach">
        <span class="support-msg__attach-title">${escapeHtml(title || "Áudio")}</span>
        <audio controls preload="none" src="${escapeHtml(src)}"></audio>
      </div>
    `;
  }

  if ((type === "file" || type === "screenshot") && path) {
    return `
      <div class="support-msg__attach">
        <span class="support-msg__attach-title">${escapeHtml(title || "Arquivo")}</span>
        <button type="button" class="support-msg__attach-action" data-support-open-path="${encodeURIComponent(path)}">Abrir anexo</button>
      </div>
    `;
  }

  if ((refType === "entry" || refType === "category" || refType === "account" || refType === "recurrence") && refId > 0) {
    return `
      <div class="support-msg__attach">
        <span class="support-msg__attach-title">${escapeHtml(title || "Referência")}</span>
        <button type="button" class="support-msg__attach-action" data-support-open-ref-type="${escapeHtml(refType)}" data-support-open-ref-id="${refId}">
          Abrir anexo
        </button>
      </div>
    `;
  }
  return "";
}

function renderSupportMessages() {
  if (!supportMessagesEl || !supportThreadEmptyEl) return;
  const current = supportCurrentThread();
  if (!current) {
    supportThreadEmptyEl.hidden = false;
    supportMessagesEl.innerHTML = "";
    return;
  }
  supportThreadEmptyEl.hidden = true;
  if (!supportMessagesCache.length) {
    supportMessagesEl.innerHTML = `<p class="category-empty">Nenhuma mensagem nesta conversa.</p>`;
    return;
  }
  const mineRole = isSupportAdminMode() ? "admin" : "user";
  supportMessagesEl.innerHTML = supportMessagesCache.map((item) => {
    const mine = String(item?.sender_role || "") === mineRole;
    const cls = mine ? "support-msg support-msg--mine" : "support-msg support-msg--other";
    const text = String(item?.message || "").trim();
    const attach = supportMessageAttachmentHtml(item);
    const time = formatSupportTime(String(item?.created_at || ""));
    return `
      <article class="${cls}">
        ${text ? `<div class="support-msg__text">${escapeHtml(text)}</div>` : ""}
        ${attach}
        <div class="support-msg__meta">${escapeHtml(time)}</div>
      </article>
    `;
  }).join("");
  supportMessagesEl.scrollTop = supportMessagesEl.scrollHeight;
}

async function loadSupportMessages() {
  const current = supportCurrentThread();
  if (!current) {
    supportMessagesCache = [];
    renderSupportMessages();
    return;
  }
  supportMessagesCache = await fetchSupportMessages(Number(current.id || 0));
  renderSupportMessages();
}

async function loadSupportThreadsAndMessages() {
  supportThreadsCache = await fetchSupportThreads();
  if (!supportThreadsCache.length) {
    await ensureSupportThreadForUser();
    supportThreadsCache = await fetchSupportThreads();
  }
  if (!supportThreadsCache.length) {
    selectedSupportThreadId = 0;
  } else if (!supportThreadsCache.some((row) => Number(row?.id || 0) === Number(selectedSupportThreadId || 0))) {
    selectedSupportThreadId = Number(supportThreadsCache[0]?.id || 0);
  }
  const unreadTotal = supportThreadsCache.reduce((acc, thread) => acc + Number(thread?.unread_count || 0), 0);
  setSupportAndNotificationBadges(unreadTotal);
  syncSupportThreadLabel();
  renderSupportThreadList();
  await loadSupportMessages();
}

async function openSupportModal(options = {}) {
  clearSupportAttachmentDraft();
  if (supportMessageInput) supportMessageInput.value = "";
  const preferredThreadId = Number(options?.threadId || 0);
  if (preferredThreadId > 0) {
    selectedSupportThreadId = preferredThreadId;
  }
  await loadSupportThreadsAndMessages();
  await supportModal?.present();
  const focusRefType = String(options?.focusRefType || "");
  const focusRefId = Number(options?.focusRefId || 0);
  if (focusRefType && focusRefId > 0) {
    await openSupportEntityReference(focusRefType, focusRefId);
  }
}

async function closeSupportModal() {
  if (supportRecording?.recorder) {
    try {
      supportRecording.recorder.stop();
    } catch {
      // no-op
    }
  }
  stopSupportRecordingIndicator();
  try {
    await supportModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openSupportThreadModal() {
  renderSupportThreadList();
  await supportThreadModal?.present();
}

async function closeSupportThreadModal() {
  try {
    await supportThreadModal?.dismiss();
  } catch {
    // no-op
  }
}

function supportAttachOptions() {
  return [
    { key: "file", label: "Imagem / Captura de tela", icon: "image" },
    { key: "entry", label: "Lançamento", icon: "receipt_long" },
    { key: "category", label: "Categoria", icon: "category" },
    { key: "account", label: "Conta / Cartão", icon: "account_balance_wallet" },
    { key: "recurrence", label: "Recorrência", icon: "event_repeat" },
  ];
}

function renderSupportAttachList() {
  if (!supportAttachListEl) return;
  supportAttachListEl.innerHTML = supportAttachOptions().map((item) => `
    <button type="button" class="category-option is-neutral" data-support-attach-key="${escapeHtml(item.key)}">
      <span class="category-option__lead"><span class="material-symbols-rounded">${escapeHtml(item.icon)}</span></span>
      <span class="category-option__text">${escapeHtml(item.label)}</span>
    </button>
  `).join("");
}

async function openSupportAttachModal() {
  renderSupportAttachList();
  await supportAttachModal?.present();
}

async function closeSupportAttachModal() {
  try {
    await supportAttachModal?.dismiss();
  } catch {
    // no-op
  }
}

function supportEntityRowsByType(type) {
  if (type === "entry") {
    return (dashboardEntriesCache || []).map((row) => ({
      id: Number(row?.id || 0),
      title: String(row?.description || row?.category || `Lançamento #${row?.id || ""}`),
      meta: `${formatIsoDate(String(row?.date || "").slice(0, 10)) || "--"} · ${money.format(Number(row?.amount || 0))}`,
    })).filter((row) => row.id > 0);
  }
  if (type === "category") {
    const allCategories = Array.isArray(categories) ? categories : [];
    const userCategories = allCategories.filter((row) => String(row?.scope || "global") === "user");
    const source = userCategories.length ? userCategories : allCategories;
    const entriesByCategory = (Array.isArray(dashboardEntriesCache) ? dashboardEntriesCache : [])
      .reduce((acc, row) => {
        const name = String(row?.category || "").trim();
        if (!name) return acc;
        acc.set(name, (acc.get(name) || 0) + 1);
        return acc;
      }, new Map());
    return source
      .map((row) => ({
        id: Number(row?.id || 0),
        title: String(row?.name || "").trim(),
        meta: `${Number(entriesByCategory.get(String(row?.name || "").trim()) || 0)} lançamento${Number(entriesByCategory.get(String(row?.name || "").trim()) || 0) === 1 ? "" : "s"}`,
      }))
      .filter((row) => row.id > 0 && row.title);
  }
  if (type === "account") {
    return (accounts || []).map((row) => ({
      id: Number(row?.id || 0),
      title: String(row?.name || ""),
      meta: String(row?.type || ""),
    })).filter((row) => row.id > 0);
  }
  if (type === "recurrence") {
    return (recurrences || []).map((row) => ({
      id: Number(row?.id || 0),
      title: String(row?.description || row?.category || `Recorrência #${row?.id || ""}`),
      meta: `${formatIsoDate(String(row?.next_run_date || row?.start_date || "").slice(0, 10)) || "--"} · ${money.format(Number(row?.amount || 0))}`,
    })).filter((row) => row.id > 0);
  }
  return [];
}

function supportEntityTitle(type) {
  return ({
    entry: "Selecionar lançamento",
    category: "Selecionar categoria",
    account: "Selecionar conta/cartão",
    recurrence: "Selecionar recorrência",
  })[type] || "Selecionar item";
}

function renderSupportEntityList() {
  if (!supportEntityListEl) return;
  const query = normalizeText(supportEntitySearchInput?.value || "");
  const rows = supportEntityPickerRows.filter((row) => {
    const text = normalizeText(`${row?.title || ""} ${row?.meta || ""}`);
    return text.includes(query);
  });
  if (!rows.length) {
    supportEntityListEl.innerHTML = `<p class="category-empty">Nenhum item encontrado.</p>`;
    return;
  }
  supportEntityListEl.innerHTML = rows.map((row) => `
    <button type="button" class="category-option category-option--text-meta is-neutral" data-support-entity-id="${Number(row?.id || 0)}">
      <span class="category-option__text-wrap">
        <span class="category-option__text">${escapeHtml(String(row?.title || ""))}</span>
        <span class="category-option__meta">${escapeHtml(String(row?.meta || ""))}</span>
      </span>
    </button>
  `).join("");
}

async function openSupportEntityModal(type) {
  supportEntityPickerType = String(type || "");
  if (supportEntityPickerType === "entry" && !dashboardEntriesCache.length) {
    const response = await authFetch("/api/entries");
    const payload = await safeJson(response, []);
    if (Array.isArray(payload)) dashboardEntriesCache = payload;
  }
  if (supportEntityPickerType === "category" && !categories.length) {
    await loadCategories();
  }
  if (supportEntityPickerType === "category" && !dashboardEntriesCache.length) {
    const response = await authFetch("/api/entries");
    const payload = await safeJson(response, []);
    if (Array.isArray(payload)) dashboardEntriesCache = payload;
  }
  if (supportEntityPickerType === "account" && !accounts.length) {
    await loadAccounts(true);
  }
  if (supportEntityPickerType === "recurrence" && !recurrences.length) {
    await loadRecurrences();
  }
  supportEntityPickerRows = supportEntityRowsByType(supportEntityPickerType);
  if (supportEntitySearchInput) supportEntitySearchInput.value = "";
  if (supportEntityModalTitleEl) supportEntityModalTitleEl.textContent = supportEntityTitle(supportEntityPickerType);
  renderSupportEntityList();
  await supportEntityModal?.present();
}

async function closeSupportEntityModal() {
  try {
    await supportEntityModal?.dismiss();
  } catch {
    // no-op
  }
}

async function uploadSupportAttachment(file, explicitType = "") {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);
  const thread = supportCurrentThread();
  if (isSupportAdminMode() && thread && Number(thread?.user_id || 0) > 0) {
    formData.append("user_id", String(Number(thread.user_id)));
  }
  const response = await fetch("/api/upload", {
    method: "POST",
    credentials: "same-origin",
    headers: authHeaders({}, { path: "/api/upload" }),
    body: formData,
  });
  if (response.status === 401) {
    window.location.href = "/";
    return null;
  }
  const payload = await safeJson(response, {});
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível enviar anexo."));
    return null;
  }
  const filePath = String(payload?.file || "").trim();
  if (!filePath) return null;
  const mime = String(file.type || "").toLowerCase();
  const type = explicitType
    || (mime.startsWith("audio/") ? "audio" : (mime.startsWith("image/") ? "screenshot" : "file"));
  return {
    type,
    path: filePath,
    title: String(file.name || "Anexo"),
  };
}

async function toggleSupportAudioRecording() {
  if (!supportRecordAudioBtn) return;
  if (supportRecording?.recorder) {
    supportRecording.recorder.stop();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === "undefined") {
    showError("Seu navegador não suporta gravação de áudio.");
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    let recorder;
    try {
      recorder = new MediaRecorder(stream, { audioBitsPerSecond: 16000 });
    } catch {
      recorder = new MediaRecorder(stream);
    }
    const chunks = [];
    recorder.addEventListener("dataavailable", (event) => {
      if (event.data && event.data.size > 0) chunks.push(event.data);
    });
    recorder.addEventListener("stop", async () => {
      stream.getTracks().forEach((track) => track.stop());
      supportRecordAudioBtn.classList.remove("is-recording");
      stopSupportRecordingIndicator();
      supportRecording = null;
      if (!chunks.length) return;
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
      const ext = String((recorder.mimeType || "audio/webm").split("/")[1] || "webm").split(";")[0];
      const file = new File([blob], `audio-${Date.now()}.${ext}`, { type: recorder.mimeType || "audio/webm" });
      const uploaded = await uploadSupportAttachment(file, "audio");
      if (!uploaded) return;
      supportAttachmentDraft = {
        type: "audio",
        path: uploaded.path,
        title: "Áudio",
      };
      syncSupportAttachmentPreview();
    });
    recorder.start();
    const startedAt = Date.now();
    supportRecording = { recorder, startedAt };
    supportRecordAudioBtn.classList.add("is-recording");
    startSupportRecordingIndicator(startedAt);
  } catch {
    stopSupportRecordingIndicator();
    showError("Não foi possível acessar o microfone.");
  }
}

async function openSupportAttachmentPath(path) {
  const clean = String(path || "").trim();
  if (!clean) return;
  const ext = clean.split(".").pop()?.toLowerCase() || "";
  const src = `/uploads/${encodeURI(clean)}`;
  if (ext === "pdf") {
    await openAttachmentViewer(src, true);
    return;
  }
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
    await openAttachmentViewer(src, false);
    return;
  }
  window.open(src, "_blank", "noopener,noreferrer");
}

async function openSupportEntityReference(refType, refId) {
  const type = String(refType || "");
  const id = Number(refId || 0);
  if (!type || id <= 0) return;
  if (isSupportAdminMode()) {
    const thread = supportCurrentThread();
    const targetUserId = Number(thread?.user_id || 0);
    if (targetUserId > 0) {
      await impersonateAdminUser(targetUserId);
      if (isSupportAdminMode()) return;
    }
  }
  if (type === "entry") {
    if (!loadedEntriesIndex.has(id)) {
      const entriesRes = await authFetch("/api/entries?include_deleted=1");
      const entriesPayload = await safeJson(entriesRes, []);
      if (Array.isArray(entriesPayload)) {
        entriesPayload.forEach((row) => {
          const rowId = Number(row?.id || 0);
          if (rowId > 0) loadedEntriesIndex.set(rowId, row);
        });
      }
    }
    await openEntryEditor(id);
    return;
  }
  if (type === "category") {
    const row = (categories || []).find((item) => Number(item?.id || 0) === id);
    if (row) {
      if (String(row?.scope || "global") === "user") {
        await openUserCategoryEditModal(row);
      } else {
        const categoryName = String(row?.name || "").trim();
        if (categoryName) await openCategoryDetailModal(categoryName);
      }
    }
    return;
  }
  if (type === "account") {
    const row = (accounts || []).find((item) => Number(item?.id || 0) === id);
    if (row) await openUserAccountEditModal(row);
    return;
  }
  if (type === "recurrence") {
    if (!(recurrences || []).some((item) => Number(item?.id || 0) === id)) {
      await loadRecurrences();
    }
    await openRecurrenceEditor(id);
  }
}

async function submitSupportMessage() {
  const thread = supportCurrentThread();
  if (!thread) {
    showError("Selecione uma conversa.");
    return;
  }
  const message = String(supportMessageInput?.value || "").trim();
  const draft = supportAttachmentDraft;
  if (!message && !draft) {
    showError("Digite uma mensagem ou anexe algo.");
    return;
  }
  if (supportSendMessageBtn) supportSendMessageBtn.disabled = true;
  try {
    const endpoint = isSupportAdminMode() ? "/api/admin/support/messages" : "/api/support/messages";
    const body = {
      thread_id: Number(thread.id || 0),
      message,
    };
    if (draft?.path) body.attachment_path = String(draft.path);
    if (draft?.type) body.attachment_type = String(draft.type);
    if (draft?.ref_type) body.attachment_ref_type = String(draft.ref_type);
    if (draft?.ref_id) body.attachment_ref_id = Number(draft.ref_id || 0);
    if (draft?.title) body.attachment_title = String(draft.title);
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "same-origin",
      headers: authHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }, { path: endpoint }),
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível enviar a mensagem."));
      return;
    }
    if (supportMessageInput) supportMessageInput.value = "";
    clearSupportAttachmentDraft();
    await loadSupportThreadsAndMessages();
  } catch {
    showError("Falha de rede ao enviar mensagem.");
  } finally {
    if (supportSendMessageBtn) supportSendMessageBtn.disabled = false;
  }
}

async function openProfileModal() {
  hydrateProfileForm();
  await profileModal?.present();
}

async function closeProfileModal() {
  try {
    await profileModal?.dismiss();
  } catch {
    // no-op
  }
}

async function saveProfilePreferences() {
  const name = String(profileNameInput?.value || "").trim();
  if (!name) {
    showError("Informe um nome válido.");
    return;
  }
  if (saveProfileModalBtn) saveProfileModalBtn.disabled = true;
  try {
    const response = await fetch("/api/account/preferences", {
      method: "PUT",
      credentials: "same-origin",
      headers: authHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({ name }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível atualizar os dados pessoais."));
      return;
    }
    currentProfile.name = String(payload?.name || name);
    if (userTitleEl) userTitleEl.textContent = currentProfile.name || currentProfile.email || "Usuário";
    syncDashMenuUserSummary();
    await closeProfileModal();
    showInfo("Dados pessoais atualizados com sucesso.");
  } catch {
    showError("Falha de rede ao atualizar os dados pessoais.");
  } finally {
    if (saveProfileModalBtn) saveProfileModalBtn.disabled = false;
  }
}

async function openPasswordModal() {
  resetPasswordForm();
  await passwordModal?.present();
}

async function closePasswordModal() {
  try {
    await passwordModal?.dismiss();
  } catch {
    // no-op
  }
}

async function saveAccountPassword() {
  const currentPassword = String(passwordCurrentInput?.value || "");
  const nextPassword = String(passwordNextInput?.value || "");
  const confirmPassword = String(passwordConfirmInput?.value || "");
  if (!currentPassword || !nextPassword || !confirmPassword) {
    showError("Preencha todos os campos de senha.");
    return;
  }
  if (nextPassword.length < 8) {
    showError("A nova senha deve ter pelo menos 8 caracteres.");
    return;
  }
  if (nextPassword !== confirmPassword) {
    showError("A confirmação da senha não confere.");
    return;
  }
  if (savePasswordModalBtn) savePasswordModalBtn.disabled = true;
  try {
    const response = await fetch("/api/account/password", {
      method: "PUT",
      credentials: "same-origin",
      headers: authHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        current_password: currentPassword,
        password: nextPassword,
      }),
    });
    if (response.status === 401) {
      window.location.href = "/";
      return;
    }
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível trocar a senha."));
      return;
    }
    await closePasswordModal();
    showInfo("Senha atualizada com sucesso.");
  } catch {
    showError("Falha de rede ao trocar a senha.");
  } finally {
    if (savePasswordModalBtn) savePasswordModalBtn.disabled = false;
  }
}

function resetAdminCategoryForm() {
  editingAdminCategoryId = 0;
  if (adminCategoryNameInput) adminCategoryNameInput.value = "";
  selectedAdminCategoryType = "out";
  if (adminCategoryAlterdataInput) adminCategoryAlterdataInput.value = "";
  if (deleteAdminCategoryModalBtn) deleteAdminCategoryModalBtn.hidden = true;
  syncAdminCategoryTypeLabel();
  if (adminCategoryStatsEl) adminCategoryStatsEl.innerHTML = '<p class="category-empty">Selecione uma categoria para ver o resumo.</p>';
}

function resetAdminUserForm() {
  editingAdminUserId = 0;
  if (adminUserNameInput) adminUserNameInput.value = "";
  if (adminUserEmailInput) adminUserEmailInput.value = "";
  if (adminUserPasswordInput) adminUserPasswordInput.value = "";
  selectedAdminUserRole = "user";
  if (adminUserAlterdataInput) adminUserAlterdataInput.value = "";
  syncAdminUserRoleLabel();
  if (adminUserStatsEl) adminUserStatsEl.innerHTML = '<p class="category-empty">Selecione um usuário para ver o resumo.</p>';
}

function normalizeMonthValue(rawValue) {
  const value = String(rawValue || "").trim();
  if (/^\d{4}-\d{2}$/.test(value)) return value;
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 7);
  return "";
}

function monthLabelFromIso(monthIso) {
  const normalized = normalizeMonthValue(monthIso);
  if (!normalized) return "--";
  const [year, month] = normalized.split("-").map((item) => Number(item));
  if (!year || !month) return "--";
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function dateTimeLabel(isoDateTime) {
  const value = String(isoDateTime || "").trim();
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function adminCategoryTypeLabel(value) {
  return value === "in" ? "Entrada" : "Saída";
}

function adminUserRoleLabel(value) {
  return value === "admin" ? "Administrador" : "Usuário";
}

function adminExportTypeLabel(value) {
  if (value === "in") return "Entradas";
  if (value === "out") return "Saídas";
  return "Todos";
}

function adminAlterdataSourceLabel(value) {
  const option = ADMIN_ALTERDATA_SOURCE_OPTIONS.find((item) => item.value === String(value || ""));
  return option ? option.label : "Lançamento";
}

function adminAlterdataFieldLabel(scope, field) {
  const fieldMap = {
    entry: {
      id: "ID do lançamento",
      date: "Data",
      amount: "Valor",
      type: "Tipo",
      type_code: "Tipo (E/S)",
      category: "Categoria",
      description: "Descrição",
      account_name: "Conta/cartão",
      account_id: "ID da conta/cartão",
    },
    category: {
      id: "ID da categoria",
      name: "Nome",
      type: "Tipo",
      alterdata_auto: "Código Alterdata",
    },
    user: {
      id: "ID do usuário",
      name: "Nome",
      email: "E-mail",
      alterdata_code: "Código Alterdata",
    },
    fixed: {
      value: "Valor fixo",
    },
  };
  const byScope = fieldMap[String(scope || "")] || {};
  return byScope[String(field || "")] || "Campo";
}

function adminAlterdataColumnDescription(column) {
  const item = ADMIN_ALTERDATA_COLUMNS_META.find((entry) => entry.column === String(column || ""));
  return item ? item.description : "Coluna";
}

function syncAdminCategoryTypeLabel() {
  if (selectedAdminCategoryTypeEl) selectedAdminCategoryTypeEl.textContent = adminCategoryTypeLabel(selectedAdminCategoryType);
}

function syncAdminUserRoleLabel() {
  if (selectedAdminUserRoleEl) selectedAdminUserRoleEl.textContent = adminUserRoleLabel(selectedAdminUserRole);
}

function syncAdminCloseMonthLabel() {
  if (selectedAdminCloseMonthDateEl) selectedAdminCloseMonthDateEl.textContent = monthLabelFromIso(selectedAdminCloseMonth);
  if (selectedAdminCloseMonthUsersEl) {
    const selectedKeys = Array.isArray(selectedAdminCloseMonthUserKeys) ? selectedAdminCloseMonthUserKeys.map((value) => String(value || "")) : ["all"];
    const isAll = selectedKeys.includes("all");
    if (isAll) {
      selectedAdminCloseMonthUsersEl.textContent = "Todos os usuários";
      return;
    }
    const users = adminUsersCache.filter((item) => selectedKeys.includes(String(item?.id || "")));
    if (users.length === 1) {
      selectedAdminCloseMonthUsersEl.textContent = String(users[0]?.name || users[0]?.email || "Usuário");
      return;
    }
    selectedAdminCloseMonthUsersEl.textContent = `${users.length} selecionados`;
  }
}

function syncAdminExportLabels() {
  if (selectedAdminExportMonthEl) selectedAdminExportMonthEl.textContent = monthLabelFromIso(selectedAdminExportMonth);
  if (selectedAdminExportTypeEl) selectedAdminExportTypeEl.textContent = adminExportTypeLabel(selectedAdminExportType);
  if (selectedAdminExportUserEl) {
    const selectedIds = Array.isArray(selectedAdminExportUserIds) ? selectedAdminExportUserIds.map((value) => String(value || "")) : ["all"];
    const isAll = selectedIds.includes("all");
    if (isAll) {
      selectedAdminExportUserEl.textContent = "Todos os usuários";
      return;
    }
    const users = adminUsersCache.filter((item) => selectedIds.includes(String(item?.id || "")));
    if (users.length === 1) {
      selectedAdminExportUserEl.textContent = String(users[0]?.name || users[0]?.email || "Usuário");
      return;
    }
    selectedAdminExportUserEl.textContent = `${users.length} selecionados`;
  }
}

function renderAdminCategoriesList(items) {
  if (!adminCategoriesListEl) return;
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) {
    adminCategoriesListEl.innerHTML = '<p class="category-empty">Nenhuma categoria global.</p>';
    return;
  }
  adminCategoriesListEl.innerHTML = rows.map((row) => {
    const id = Number(row?.id || 0);
    const name = escapeHtml(String(row?.name || ""));
    const type = adminCategoryTypeLabel(String(row?.type || ""));
    const alter = escapeHtml(String(row?.alterdata_auto || ""));
    const detail = `${type} · ${alter ? alter : "Sem código"}`;
    return `
      <button type="button" class="category-option category-option--admin-row is-neutral" data-admin-category-select="${id}">
        <span class="category-option__lead"><span class="material-symbols-rounded">category</span></span>
        <span class="category-option__text">${name} · ${escapeHtml(detail)}</span>
        <span class="material-symbols-rounded category-option__trail">chevron_right</span>
      </button>
    `;
  }).join("");
}

function renderAdminUsersList(items) {
  if (!adminUsersListEl) return;
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) {
    adminUsersListEl.innerHTML = '<p class="category-empty">Nenhum usuário cadastrado.</p>';
    return;
  }
  adminUsersListEl.innerHTML = rows.map((row) => {
    const id = Number(row?.id || 0);
    const name = escapeHtml(String(row?.name || ""));
    const role = adminUserRoleLabel(String(row?.role || ""));
    const alter = escapeHtml(String(row?.alterdata_code || ""));
    const email = escapeHtml(String(row?.email || ""));
    const detail = `${email} · ${role} · ${alter ? `Alterdata ${alter}` : "Sem código Alterdata"}`;
    return `
      <button type="button" class="category-option category-option--admin-row is-neutral" data-admin-user-select="${id}">
        <span class="category-option__lead"><span class="material-symbols-rounded">person</span></span>
        <span class="category-option__text">${name} · ${escapeHtml(detail)}</span>
        <span class="material-symbols-rounded category-option__trail">chevron_right</span>
      </button>
    `;
  }).join("");
}

function renderAdminImpersonateUsersList(items) {
  if (!adminImpersonateListEl) return;
  const rows = (Array.isArray(items) ? items : []).filter((row) => String(row?.role || "") !== "admin");
  if (!rows.length) {
    adminImpersonateListEl.innerHTML = '<p class="category-empty">Nenhum usuário disponível para personificação.</p>';
    return;
  }
  adminImpersonateListEl.innerHTML = rows.map((row) => {
    const id = Number(row?.id || 0);
    const name = escapeHtml(String(row?.name || row?.email || ""));
    const email = escapeHtml(String(row?.email || ""));
    const selected = Number(selectedAdminImpersonateUserId || 0) === id;
    return `
      <button type="button" class="category-option is-neutral" data-admin-impersonate-user-id="${id}"${selected ? ' aria-current="true"' : ""}>
        <span class="category-option__lead"><span class="material-symbols-rounded">person</span></span>
        <span class="category-option__text">${name} · ${email}</span>
      </button>
    `;
  }).join("");
}

function renderAdminUsersCheckboxes(items) {
  if (!adminCloseMonthUsersEl) return;
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) {
    adminCloseMonthUsersEl.innerHTML = '<p class="category-empty">Nenhum usuário disponível.</p>';
    return;
  }
  const selectedKeys = Array.isArray(selectedAdminCloseMonthUserKeys) ? selectedAdminCloseMonthUserKeys.map((value) => String(value || "")) : ["all"];
  const allSelected = selectedKeys.includes("all");
  const userOptions = rows.map((row) => {
    const id = Number(row?.id || 0);
    const name = escapeHtml(String(row?.name || row?.email || ""));
    const role = String(row?.role || "user");
    const roleLabel = adminUserRoleLabel(role);
    const icon = role === "admin" ? "admin_panel_settings" : "person";
    const selected = !allSelected && selectedKeys.includes(String(id));
    return `
      <button type="button" class="category-option is-neutral" data-admin-close-user-id="${id}"${selected ? ' aria-current="true"' : ""}>
        <span class="category-option__lead"><span class="material-symbols-rounded">${icon}</span></span>
        <span class="category-option__text">${name} · ${escapeHtml(roleLabel)}</span>
      </button>
    `;
  }).join("");
  adminCloseMonthUsersEl.innerHTML = `
    <button type="button" class="category-option is-neutral" data-admin-close-user-id="all"${allSelected ? ' aria-current="true"' : ""}>
      <span class="category-option__lead"><span class="material-symbols-rounded">groups</span></span>
      <span class="category-option__text">Todos os usuários</span>
    </button>
  ` + userOptions;
}

function renderAdminExportUsersList(items) {
  if (!adminExportUserListEl) return;
  const rows = Array.isArray(items) ? items : [];
  const selectedIds = Array.isArray(selectedAdminExportUserIds) ? selectedAdminExportUserIds.map((value) => String(value || "")) : ["all"];
  const allSelected = selectedIds.includes("all");
  const options = [
    `<button type="button" class="category-option is-neutral" data-admin-export-user-id="all"${allSelected ? ' aria-current="true"' : ""}>
      <span class="category-option__lead"><span class="material-symbols-rounded">group</span></span>
      <span class="category-option__text">Todos os usuários</span>
    </button>`,
  ];
  rows.forEach((row) => {
    const id = Number(row?.id || 0);
    const name = escapeHtml(String(row?.name || row?.email || ""));
    const role = String(row?.role || "user");
    const roleLabel = adminUserRoleLabel(role);
    const icon = role === "admin" ? "admin_panel_settings" : "person";
    const selected = !allSelected && selectedIds.includes(String(id));
    options.push(`
      <button type="button" class="category-option is-neutral" data-admin-export-user-id="${id}"${selected ? ' aria-current="true"' : ""}>
        <span class="category-option__lead"><span class="material-symbols-rounded">${icon}</span></span>
        <span class="category-option__text">${name} · ${escapeHtml(roleLabel)}</span>
      </button>
    `);
  });
  adminExportUserListEl.innerHTML = options.join("");
}

function renderAdminCloseMonthHistory(items) {
  if (!adminCloseMonthHistoryEl) return;
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) {
    adminCloseMonthHistoryEl.innerHTML = '<p class="category-empty">Nenhum fechamento registrado.</p>';
    return;
  }
  adminCloseMonthHistoryEl.innerHTML = rows.map((row) => {
    const month = monthLabelFromIso(String(row?.month || ""));
    const users = Number(row?.users_affected || 0);
    const records = Number(row?.records_affected || 0);
    const actor = escapeHtml(String(row?.actor?.name || row?.actor?.email || "Administrador"));
    const when = dateTimeLabel(String(row?.created_at || ""));
    const closed = Boolean(row?.payload?.closed ?? true);
    const actionLabel = closed ? "Fechamento aplicado" : "Fechamento removido";
    const title = `${actionLabel} · ${month}`;
    const meta = `${users} usuários · ${records} registros · ${actor} · ${when}`;
    return `
      <div class="category-option category-option--history is-neutral">
        <span class="category-option__lead"><span class="material-symbols-rounded">event_available</span></span>
        <span class="category-option__text">
          <span class="admin-history__title">${escapeHtml(title)}</span>
          <span class="admin-history__meta">${escapeHtml(meta)}</span>
        </span>
      </div>
    `;
  }).join("");
}

function renderAdminExportHistory(items) {
  if (!adminExportHistoryEl) return;
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) {
    adminExportHistoryEl.innerHTML = '<p class="category-empty">Nenhuma exportação registrada.</p>';
    return;
  }
  adminExportHistoryEl.innerHTML = rows.map((row) => {
    const month = monthLabelFromIso(String(row?.month || ""));
    const users = Number(row?.users_affected || 0);
    const records = Number(row?.records_affected || 0);
    const actor = escapeHtml(String(row?.actor?.name || row?.actor?.email || "Administrador"));
    const when = dateTimeLabel(String(row?.created_at || ""));
    const type = adminExportTypeLabel(String(row?.payload?.type || "all"));
    const title = `${month} · ${type}`;
    const meta = `${users} usuários · ${records} lançamentos · ${actor} · ${when}`;
    return `
      <div class="category-option category-option--history is-neutral">
        <span class="category-option__lead"><span class="material-symbols-rounded">download</span></span>
        <span class="category-option__text">
          <span class="admin-history__title">${escapeHtml(title)}</span>
          <span class="admin-history__meta">${escapeHtml(meta)}</span>
        </span>
      </div>
    `;
  }).join("");
}

function renderAdminCategoryTypeList() {
  if (!adminCategoryTypeListEl) return;
  const options = [
    { value: "out", label: "Saída", icon: "arrow_upward", tone: "out" },
    { value: "in", label: "Entrada", icon: "arrow_downward", tone: "in" },
  ];
  adminCategoryTypeListEl.innerHTML = options.map((item) => `
    <button type="button" class="category-option is-${item.tone}" data-admin-category-type="${item.value}"${selectedAdminCategoryType === item.value ? ' aria-current="true"' : ""}>
      <span class="category-option__lead"><span class="material-symbols-rounded">${item.icon}</span></span>
      <span class="category-option__text">${item.label}</span>
    </button>
  `).join("");
}

function renderAdminUserRoleList() {
  if (!adminUserRoleListEl) return;
  const options = [
    { value: "user", label: "Usuário", icon: "person" },
    { value: "admin", label: "Administrador", icon: "admin_panel_settings" },
  ];
  adminUserRoleListEl.innerHTML = options.map((item) => `
    <button type="button" class="category-option is-neutral" data-admin-user-role="${item.value}"${selectedAdminUserRole === item.value ? ' aria-current="true"' : ""}>
      <span class="category-option__lead"><span class="material-symbols-rounded">${item.icon}</span></span>
      <span class="category-option__text">${item.label}</span>
    </button>
  `).join("");
}

function renderAdminExportTypeList() {
  if (!adminExportTypeListEl) return;
  const options = [
    { value: "all", label: "Todos", icon: "apps" },
    { value: "in", label: "Entradas", icon: "arrow_downward" },
    { value: "out", label: "Saídas", icon: "arrow_upward" },
  ];
  adminExportTypeListEl.innerHTML = options.map((item) => `
    <button type="button" class="category-option is-neutral" data-admin-export-type="${item.value}"${selectedAdminExportType === item.value ? ' aria-current="true"' : ""}>
      <span class="category-option__lead"><span class="material-symbols-rounded">${item.icon}</span></span>
      <span class="category-option__text">${item.label}</span>
    </button>
  `).join("");
}

async function fetchAdminUsers() {
  const response = await authFetch("/api/admin/users");
  if (response.status === 401) {
    window.location.href = "/";
    return [];
  }
  const payload = await safeJson(response, []);
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível carregar usuários."));
    return [];
  }
  adminUsersCache = Array.isArray(payload) ? payload : [];
  return adminUsersCache;
}

async function fetchAdminPendingEntries() {
  const response = await authFetch("/api/admin/entries?needs_review=1");
  if (response.status === 401) {
    window.location.href = "/";
    return [];
  }
  const payload = await safeJson(response, []);
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível carregar lançamentos pendentes."));
    return [];
  }
  adminPendingEntriesCache = Array.isArray(payload) ? payload : [];
  return adminPendingEntriesCache;
}

function syncAdminPendingEntriesBadge(count) {
  if (!adminPendingEntriesBadgeEl) return;
  const qty = Number(count || 0);
  const shouldHide = !Number.isFinite(qty) || qty <= 0;
  adminPendingEntriesBadgeEl.hidden = shouldHide;
  adminPendingEntriesBadgeEl.textContent = shouldHide ? "" : String(Math.max(0, qty));
}

function renderAdminPendingEntriesList(items, users) {
  if (!adminPendingEntriesListEl) return;
  const rows = Array.isArray(items) ? items : [];
  if (!rows.length) {
    adminPendingEntriesListEl.innerHTML = '<p class="category-empty">Nenhuma pendência encontrada.</p>';
    return;
  }

  const userMap = new Map((Array.isArray(users) ? users : []).map((row) => [Number(row?.id || 0), row]));
  const grouped = new Map();
  rows.forEach((row) => {
    const uid = Number(row?.user_id || 0);
    if (!grouped.has(uid)) grouped.set(uid, []);
    grouped.get(uid).push(row);
  });

  const html = Array.from(grouped.entries()).map(([uid, entries]) => {
    const user = userMap.get(uid);
    const userName = escapeHtml(String(user?.name || user?.email || `Usuário #${uid}`));
    const countText = entries.length === 1 ? "1 pendência" : `${entries.length} pendências`;
    const entriesHtml = entries.map((entry) => {
      const id = Number(entry?.id || 0);
      const type = String(entry?.type || "") === "in" ? "in" : "out";
      const icon = type === "in" ? "arrow_downward" : "arrow_upward";
      const title = escapeHtml(String(entry?.description || entry?.category || "Lançamento"));
      const meta = escapeHtml(`${String(entry?.category || "Sem categoria")} · ${formatIsoDate(String(entry?.date || "").slice(0, 10)) || "--"}`);
      const amount = Number(entry?.amount || 0);
      const signed = type === "out" ? -Math.abs(amount) : Math.abs(amount);
      return `
        <button type="button" class="category-option category-option--pending-entry is-${type}" data-admin-pending-entry-id="${id}">
          <span class="category-option__lead"><span class="material-symbols-rounded">${icon}</span></span>
          <span class="category-option__text">${title} · ${meta} · ${escapeHtml(money.format(signed))}</span>
        </button>
      `;
    }).join("");
    return `
      <section class="category-group">
        <h4 class="category-group__title">${userName} · ${countText}</h4>
        <div class="category-group__items">${entriesHtml}</div>
      </section>
    `;
  }).join("");

  adminPendingEntriesListEl.innerHTML = html;
}

async function fetchAdminCategories() {
  const response = await authFetch("/api/admin/categories");
  if (response.status === 401) {
    window.location.href = "/";
    return [];
  }
  const payload = await safeJson(response, []);
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível carregar categorias globais."));
    return [];
  }
  adminCategoriesCache = Array.isArray(payload) ? payload : [];
  return adminCategoriesCache;
}

async function fetchAdminCloseMonthHistory() {
  const response = await authFetch("/api/admin/close-month/history");
  if (response.status === 401) {
    window.location.href = "/";
    return [];
  }
  const payload = await safeJson(response, {});
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível carregar histórico de fechamento."));
    return [];
  }
  return Array.isArray(payload?.items) ? payload.items : [];
}

async function fetchAdminExportHistory() {
  const response = await authFetch("/api/admin/export/alterdata/history");
  if (response.status === 401) {
    window.location.href = "/";
    return [];
  }
  const payload = await safeJson(response, {});
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível carregar histórico de exportação."));
    return [];
  }
  return Array.isArray(payload?.items) ? payload.items : [];
}

function normalizeAdminAlterdataColumns(columns) {
  const rows = Array.isArray(columns) ? columns : [];
  const map = new Map(rows.map((item) => [String(item?.column || ""), item]));
  return ADMIN_ALTERDATA_COLUMNS_META.map((meta) => {
    const row = map.get(meta.column) || {};
    return {
      column: meta.column,
      source_scope: String(row?.source_scope || "entry"),
      source_field: String(row?.source_field || "date"),
      fixed_value: String(row?.fixed_value || ""),
      updated_at: String(row?.updated_at || ""),
    };
  });
}

async function fetchAdminAlterdataConfig() {
  const response = await authFetch("/api/admin/export/alterdata/config");
  if (response.status === 401) {
    window.location.href = "/";
    return { columns: [], allowed_fields: {} };
  }
  const payload = await safeJson(response, {});
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível carregar configuração do Alterdata."));
    return { columns: [], allowed_fields: {} };
  }
  adminAlterdataAllowedFields = (payload && typeof payload.allowed_fields === "object" && payload.allowed_fields)
    ? payload.allowed_fields
    : {};
  adminAlterdataConfigColumns = normalizeAdminAlterdataColumns(payload?.columns);
  return {
    columns: adminAlterdataConfigColumns,
    allowed_fields: adminAlterdataAllowedFields,
  };
}

function renderAdminAlterdataConfigList(items) {
  if (!adminAlterdataConfigListEl) return;
  const rows = normalizeAdminAlterdataColumns(items);
  adminAlterdataConfigListEl.innerHTML = rows.map((row) => {
    const column = String(row?.column || "");
    const description = adminAlterdataColumnDescription(column);
    return `
      <button type="button" class="category-option category-option--admin-row category-option--admin-text-only is-neutral" data-admin-alterdata-column="${column}">
        <span class="category-option__text">${column} · ${escapeHtml(description)}</span>
        <span class="material-symbols-rounded category-option__trail">chevron_right</span>
      </button>
    `;
  }).join("");
}

function renderAdminAlterdataSourceList() {
  if (!adminAlterdataSourceListEl) return;
  adminAlterdataSourceListEl.innerHTML = ADMIN_ALTERDATA_SOURCE_OPTIONS.map((option) => `
    <button type="button" class="category-option is-neutral" data-admin-alterdata-source="${option.value}"${selectedAdminAlterdataSourceScope === option.value ? ' aria-current="true"' : ""}>
      <span class="category-option__lead"><span class="material-symbols-rounded">${option.icon}</span></span>
      <span class="category-option__text">${option.label}</span>
    </button>
  `).join("");
}

function renderAdminAlterdataFieldList() {
  if (!adminAlterdataFieldListEl) return;
  const scope = String(selectedAdminAlterdataSourceScope || "entry");
  const allowed = Array.isArray(adminAlterdataAllowedFields?.[scope]) ? adminAlterdataAllowedFields[scope] : [];
  if (!allowed.length) {
    adminAlterdataFieldListEl.innerHTML = '<p class="category-empty">Nenhum campo disponível.</p>';
    return;
  }
  adminAlterdataFieldListEl.innerHTML = allowed.map((field) => `
    <button type="button" class="category-option is-neutral" data-admin-alterdata-field="${escapeHtml(String(field))}"${selectedAdminAlterdataSourceField === field ? ' aria-current="true"' : ""}>
      <span class="category-option__lead"><span class="material-symbols-rounded">list_alt</span></span>
      <span class="category-option__text">${escapeHtml(adminAlterdataFieldLabel(scope, field))}</span>
    </button>
  `).join("");
}

function syncAdminAlterdataColumnEditor() {
  if (selectedAdminAlterdataSourceEl) {
    selectedAdminAlterdataSourceEl.textContent = adminAlterdataSourceLabel(selectedAdminAlterdataSourceScope);
  }
  if (selectedAdminAlterdataFieldEl) {
    selectedAdminAlterdataFieldEl.textContent = adminAlterdataFieldLabel(selectedAdminAlterdataSourceScope, selectedAdminAlterdataSourceField);
  }
  if (adminAlterdataFixedWrapEl) {
    adminAlterdataFixedWrapEl.hidden = selectedAdminAlterdataSourceScope !== "fixed";
  }
}

async function fetchAdminCategoryStats(categoryId) {
  const response = await authFetch(`/api/admin/categories/${Number(categoryId || 0)}/stats`);
  const payload = await safeJson(response, {});
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível carregar o resumo da categoria."));
    return null;
  }
  return payload;
}

async function fetchAdminUserStats(userId) {
  const response = await authFetch(`/api/admin/users/${Number(userId || 0)}/stats`);
  const payload = await safeJson(response, {});
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível carregar o resumo do usuário."));
    return null;
  }
  return payload;
}

function renderAdminCategoryStats(stats) {
  if (!adminCategoryStatsEl) return;
  if (!stats) {
    adminCategoryStatsEl.innerHTML = '<p class="category-empty">Resumo indisponível.</p>';
    return;
  }
  adminCategoryStatsEl.innerHTML = `
    <article class="settings-item"><p class="settings-item__text">Categorias filhas: <strong>${Number(stats?.child_categories || 0)}</strong></p></article>
    <article class="settings-item"><p class="settings-item__text">Lançamentos vinculados: <strong>${Number(stats?.entries || 0)}</strong></p></article>
    <article class="settings-item"><p class="settings-item__text">Recorrências ativas: <strong>${Number(stats?.recurrences || 0)}</strong></p></article>
    <article class="settings-item"><p class="settings-item__text">Usuários com vínculo: <strong>${Number(stats?.users || 0)}</strong></p></article>
  `;
}

function renderAdminUserStats(stats) {
  if (!adminUserStatsEl) return;
  if (!stats) {
    adminUserStatsEl.innerHTML = '<p class="category-empty">Resumo indisponível.</p>';
    return;
  }
  adminUserStatsEl.innerHTML = `
    <article class="settings-item"><p class="settings-item__text">Lançamentos: <strong>${Number(stats?.entries || 0)}</strong></p></article>
    <article class="settings-item"><p class="settings-item__text">Recorrências ativas: <strong>${Number(stats?.recurrences || 0)}</strong></p></article>
    <article class="settings-item"><p class="settings-item__text">Contas/cartões ativos: <strong>${Number(stats?.accounts || 0)}</strong></p></article>
    <article class="settings-item"><p class="settings-item__text">Categorias filhas: <strong>${Number(stats?.categories || 0)}</strong></p></article>
    <article class="settings-item"><p class="settings-item__text">Pendentes de revisão: <strong>${Number(stats?.pending_review || 0)}</strong></p></article>
  `;
}

async function openAdminCategoriesModal() {
  const items = await fetchAdminCategories();
  renderAdminCategoriesList(items);
  await adminCategoriesModal?.present();
}

async function closeAdminCategoriesModal() {
  try {
    await adminCategoriesModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminCategoryEditorModal() {
  await adminCategoryEditorModal?.present();
}

async function closeAdminCategoryEditorModal() {
  try {
    await adminCategoryEditorModal?.dismiss();
  } catch {
    // no-op
  }
}

async function saveAdminCategory() {
  const name = String(adminCategoryNameInput?.value || "").trim();
  const type = String(selectedAdminCategoryType || "out");
  const alterdataAuto = String(adminCategoryAlterdataInput?.value || "").trim();
  if (!name) {
    showError("Informe o nome da categoria global.");
    return;
  }
  if (!alterdataAuto) {
    showError("Código Alterdata é obrigatório para categoria global.");
    return;
  }
  if (saveAdminCategoryModalBtn) saveAdminCategoryModalBtn.disabled = true;
  try {
    const endpoint = editingAdminCategoryId > 0 ? `/api/admin/categories/${editingAdminCategoryId}` : "/api/admin/categories";
    const method = editingAdminCategoryId > 0 ? "PUT" : "POST";
    const response = await fetch(endpoint, {
      method,
      credentials: "same-origin",
      headers: adminAuthHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        name,
        type,
        alterdata_auto: alterdataAuto,
      }),
    });
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível salvar a categoria global."));
      return;
    }
    showInfo(editingAdminCategoryId > 0 ? "Categoria global atualizada." : "Categoria global criada.");
    resetAdminCategoryForm();
    const items = await fetchAdminCategories();
    renderAdminCategoriesList(items);
    await closeAdminCategoryEditorModal();
  } catch {
    showError("Falha de rede ao salvar categoria global.");
  } finally {
    if (saveAdminCategoryModalBtn) saveAdminCategoryModalBtn.disabled = false;
  }
}

async function deleteAdminCategory(id) {
  const confirmed = await confirmActionModal({
    header: "Excluir categoria global",
    message: "Esta ação não pode ser desfeita.",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    confirmRole: "destructive",
  });
  if (!confirmed) return;
  const response = await fetch(`/api/admin/categories/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: adminAuthHeaders({ Accept: "application/json" }),
  });
  const payload = await safeJson(response, {});
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível excluir a categoria global."));
    return;
  }
  showInfo("Categoria global excluída.");
  const items = await fetchAdminCategories();
  renderAdminCategoriesList(items);
  resetAdminCategoryForm();
  await closeAdminCategoryEditorModal();
}

async function openAdminUsersModal() {
  const items = await fetchAdminUsers();
  renderAdminUsersList(items);
  await adminUsersModal?.present();
}

async function openAdminPendingEntriesModal() {
  const [users, entries] = await Promise.all([
    adminUsersCache.length ? Promise.resolve(adminUsersCache) : fetchAdminUsers(),
    fetchAdminPendingEntries(),
  ]);
  syncAdminPendingEntriesBadge(entries.length);
  renderAdminPendingEntriesList(entries, users);
  await adminPendingEntriesModal?.present();
}

async function closeAdminPendingEntriesModal() {
  try {
    await adminPendingEntriesModal?.dismiss();
  } catch {
    // no-op
  }
}

async function closeAdminUsersModal() {
  try {
    await adminUsersModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminImpersonateModal() {
  const items = adminUsersCache.length ? adminUsersCache : await fetchAdminUsers();
  selectedAdminImpersonateUserId = 0;
  renderAdminImpersonateUsersList(items);
  if (saveAdminImpersonateModalBtn) saveAdminImpersonateModalBtn.disabled = true;
  await adminImpersonateModal?.present();
}

async function closeAdminImpersonateModal() {
  try {
    await adminImpersonateModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminUserEditorModal() {
  await adminUserEditorModal?.present();
}

async function closeAdminUserEditorModal() {
  try {
    await adminUserEditorModal?.dismiss();
  } catch {
    // no-op
  }
}

async function saveAdminUser() {
  const name = String(adminUserNameInput?.value || "").trim();
  const email = String(adminUserEmailInput?.value || "").trim();
  const password = String(adminUserPasswordInput?.value || "");
  const role = String(selectedAdminUserRole || "user").trim() || "user";
  const alterdataCode = String(adminUserAlterdataInput?.value || "").trim();
  if (!name || !email) {
    showError("Informe nome e e-mail do usuário.");
    return;
  }
  if (editingAdminUserId <= 0 && password.length < 8) {
    showError("No cadastro, a senha precisa ter ao menos 8 caracteres.");
    return;
  }
  if (saveAdminUserModalBtn) saveAdminUserModalBtn.disabled = true;
  try {
    const endpoint = editingAdminUserId > 0 ? `/api/admin/users/${editingAdminUserId}` : "/api/admin/users";
    const method = editingAdminUserId > 0 ? "PUT" : "POST";
    const body = {
      name,
      email,
      role,
      alterdata_code: alterdataCode,
    };
    if (password) {
      body.password = password;
    }
    const response = await fetch(endpoint, {
      method,
      credentials: "same-origin",
      headers: adminAuthHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(body),
    });
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível salvar o usuário."));
      return;
    }
    showInfo(editingAdminUserId > 0 ? "Usuário atualizado." : "Usuário criado.");
    resetAdminUserForm();
    const users = await fetchAdminUsers();
    renderAdminUsersList(users);
    renderAdminUsersCheckboxes(users);
    renderAdminExportUsersList(users);
    syncAdminExportLabels();
    await closeAdminUserEditorModal();
  } catch {
    showError("Falha de rede ao salvar usuário.");
  } finally {
    if (saveAdminUserModalBtn) saveAdminUserModalBtn.disabled = false;
  }
}

async function impersonateAdminUser(userId) {
  const id = Number(userId || 0);
  if (id <= 0) return;
  const currentToken = getStoredAuthToken();
  if (!currentToken) {
    showError("Sessão inválida para personificação.");
    return;
  }
  if (saveAdminImpersonateModalBtn) saveAdminImpersonateModalBtn.disabled = true;
  try {
    const response = await fetch(`/api/admin/users/${id}/impersonate`, {
      method: "POST",
      credentials: "same-origin",
      headers: adminAuthHeaders({ Accept: "application/json" }),
    });
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível iniciar personificação."));
      return;
    }
    const nextToken = String(payload?.token || "");
    if (!nextToken) {
      showError("Token de personificação inválido.");
      return;
    }
    try {
      localStorage.setItem(IMPERSONATION_ADMIN_TOKEN_KEY, currentToken);
    } catch {
      // ignore storage errors
    }
    setStoredAuthToken(nextToken);
    const userName = String(payload?.user?.name || payload?.user?.email || "usuário");
    showInfo(`Personificação iniciada: ${userName}.`);
    await closeAdminImpersonateModal();
    await closeAdminUserEditorModal();
    await closeAdminUsersModal();
    await loadDashboard();
  } catch {
    showError("Falha de rede ao iniciar personificação.");
  } finally {
    if (saveAdminImpersonateModalBtn) saveAdminImpersonateModalBtn.disabled = false;
  }
}

async function deleteAdminUser(id) {
  const confirmed = await confirmActionModal({
    header: "Excluir usuário",
    message: "Esta ação não pode ser desfeita.",
    confirmText: "Excluir",
    cancelText: "Cancelar",
    confirmRole: "destructive",
  });
  if (!confirmed) return;
  const response = await fetch(`/api/admin/users/${id}`, {
    method: "DELETE",
    credentials: "same-origin",
    headers: adminAuthHeaders({ Accept: "application/json" }),
  });
  const payload = await safeJson(response, {});
  if (!response.ok) {
    showError(String(payload?.error || "Não foi possível excluir o usuário."));
    return;
  }
  showInfo("Usuário excluído.");
  const users = await fetchAdminUsers();
  renderAdminUsersList(users);
  renderAdminUsersCheckboxes(users);
  renderAdminExportUsersList(users);
  syncAdminExportLabels();
  resetAdminUserForm();
  await closeAdminUserEditorModal();
}

async function stopImpersonation() {
  let adminToken = "";
  try {
    adminToken = String(localStorage.getItem(IMPERSONATION_ADMIN_TOKEN_KEY) || "");
  } catch {
    adminToken = "";
  }
  if (!adminToken) {
    showError("Token do administrador não encontrado para encerrar personificação.");
    return;
  }
  setStoredAuthToken(adminToken);
  try {
    localStorage.removeItem(IMPERSONATION_ADMIN_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
  showInfo("Personificação encerrada.");
  await loadDashboard();
}

async function openAdminCloseMonthModal(options = {}) {
  const users = adminUsersCache.length ? adminUsersCache : await fetchAdminUsers();
  const history = await fetchAdminCloseMonthHistory();
  const monthOverride = normalizeMonthValue(String(options?.month || ""));
  const userKeysOverride = Array.isArray(options?.userKeys)
    ? options.userKeys.map((value) => String(value || "")).filter((value) => value.length > 0)
    : [];
  selectedAdminCloseMonth = monthOverride || normalizeMonthValue(selectedAdminCloseMonth || monthRange()) || monthRange();
  selectedAdminCloseMonthUserKeys = userKeysOverride.length ? userKeysOverride : ["all"];
  renderAdminUsersCheckboxes(users);
  renderAdminCloseMonthHistory(history);
  syncAdminCloseMonthLabel();
  await adminCloseMonthModal?.present();
}

async function closeAdminCloseMonthModal() {
  try {
    await adminCloseMonthModal?.dismiss();
  } catch {
    // no-op
  }
}

async function submitAdminCloseMonth() {
  const month = String(selectedAdminCloseMonth || "").trim();
  const selectedKeys = Array.isArray(selectedAdminCloseMonthUserKeys) ? selectedAdminCloseMonthUserKeys.map((value) => String(value || "")) : ["all"];
  const allUsers = selectedKeys.includes("all");
  const userIds = allUsers
    ? []
    : Array.from(new Set(selectedKeys.map((value) => Number(value)).filter((id) => id > 0)));
  if (!month) {
    showError("Informe o mês para fechamento.");
    return;
  }
  if (!allUsers && !userIds.length) {
    showError("Selecione ao menos um usuário.");
    return;
  }
  if (saveAdminCloseMonthModalBtn) saveAdminCloseMonthModalBtn.disabled = true;
  try {
    const response = await fetch("/api/admin/close-month", {
      method: "POST",
      credentials: "same-origin",
      headers: adminAuthHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        month,
        closed: true,
        all_users: allUsers,
        user_ids: userIds,
      }),
    });
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível fechar o mês."));
      return;
    }
    showInfo(`Fechamento de ${month} aplicado.`);
    await closeAdminCloseMonthModal();
  } catch {
    showError("Falha de rede ao fechar mês.");
  } finally {
    if (saveAdminCloseMonthModalBtn) saveAdminCloseMonthModalBtn.disabled = false;
  }
}

async function openAdminExportModal() {
  const users = adminUsersCache.length ? adminUsersCache : await fetchAdminUsers();
  const history = await fetchAdminExportHistory();
  selectedAdminExportMonth = normalizeMonthValue(monthRange()) || monthRange();
  selectedAdminExportType = "all";
  selectedAdminExportUserIds = ["all"];
  renderAdminExportUsersList(users);
  renderAdminExportHistory(history);
  syncAdminExportLabels();
  await adminExportModal?.present();
}

async function closeAdminExportModal() {
  try {
    await adminExportModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminAlterdataConfigModal() {
  const payload = await fetchAdminAlterdataConfig();
  renderAdminAlterdataConfigList(payload.columns);
  await adminAlterdataConfigModal?.present();
}

async function closeAdminAlterdataConfigModal() {
  try {
    await adminAlterdataConfigModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminAlterdataColumnModal(column) {
  const key = String(column || "").trim().toUpperCase();
  if (!key) return;
  const current = normalizeAdminAlterdataColumns(adminAlterdataConfigColumns).find((item) => String(item?.column || "") === key);
  if (!current) return;
  editingAdminAlterdataColumn = key;
  selectedAdminAlterdataSourceScope = String(current?.source_scope || "entry");
  selectedAdminAlterdataSourceField = String(current?.source_field || "date");
  const allowed = Array.isArray(adminAlterdataAllowedFields?.[selectedAdminAlterdataSourceScope])
    ? adminAlterdataAllowedFields[selectedAdminAlterdataSourceScope]
    : [];
  if (allowed.length && !allowed.includes(selectedAdminAlterdataSourceField)) {
    selectedAdminAlterdataSourceField = String(allowed[0] || "");
  }
  if (adminAlterdataFixedValueInput) adminAlterdataFixedValueInput.value = String(current?.fixed_value || "");
  if (adminAlterdataColumnTitleEl) {
    adminAlterdataColumnTitleEl.textContent = `Coluna ${key} · ${adminAlterdataColumnDescription(key)}`;
  }
  syncAdminAlterdataColumnEditor();
  await adminAlterdataColumnModal?.present();
}

async function closeAdminAlterdataColumnModal() {
  try {
    await adminAlterdataColumnModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminAlterdataSourceModal() {
  renderAdminAlterdataSourceList();
  await adminAlterdataSourceModal?.present();
}

async function closeAdminAlterdataSourceModal() {
  try {
    await adminAlterdataSourceModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminAlterdataFieldModal() {
  renderAdminAlterdataFieldList();
  await adminAlterdataFieldModal?.present();
}

async function closeAdminAlterdataFieldModal() {
  try {
    await adminAlterdataFieldModal?.dismiss();
  } catch {
    // no-op
  }
}

async function saveAdminAlterdataColumnConfig() {
  const column = String(editingAdminAlterdataColumn || "").trim().toUpperCase();
  if (!column) {
    showError("Coluna inválida.");
    return;
  }
  const scope = String(selectedAdminAlterdataSourceScope || "").trim();
  const field = String(selectedAdminAlterdataSourceField || "").trim();
  const fixed = String(adminAlterdataFixedValueInput?.value || "").trim();
  if (!scope || !field) {
    showError("Selecione origem e campo.");
    return;
  }
  if (scope === "fixed" && !fixed) {
    showError("Informe o valor fixo da coluna.");
    return;
  }
  if (saveAdminAlterdataColumnModalBtn) saveAdminAlterdataColumnModalBtn.disabled = true;
  try {
    const response = await fetch(`/api/admin/export/alterdata/config/${column}`, {
      method: "PUT",
      credentials: "same-origin",
      headers: adminAuthHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        source_scope: scope,
        source_field: field,
        fixed_value: scope === "fixed" ? fixed : "",
      }),
    });
    const payload = await safeJson(response, {});
    if (!response.ok) {
      showError(String(payload?.error || "Não foi possível salvar a configuração da coluna."));
      return;
    }
    const next = normalizeAdminAlterdataColumns(adminAlterdataConfigColumns).map((row) => {
      if (String(row?.column || "") !== column) return row;
      return {
        ...row,
        source_scope: scope,
        source_field: field,
        fixed_value: scope === "fixed" ? fixed : "",
        updated_at: String(payload?.updated_at || row?.updated_at || ""),
      };
    });
    adminAlterdataConfigColumns = next;
    renderAdminAlterdataConfigList(next);
    await closeAdminAlterdataColumnModal();
    showInfo(`Configuração da coluna ${column} atualizada.`);
  } catch {
    showError("Falha de rede ao salvar configuração da coluna.");
  } finally {
    if (saveAdminAlterdataColumnModalBtn) saveAdminAlterdataColumnModalBtn.disabled = false;
  }
}

async function submitAdminExport() {
  const month = String(selectedAdminExportMonth || "").trim();
  const type = String(selectedAdminExportType || "all").trim() || "all";
  const selectedIds = Array.isArray(selectedAdminExportUserIds) ? selectedAdminExportUserIds.map((value) => String(value || "")) : ["all"];
  const allUsers = selectedIds.includes("all");
  const userIds = allUsers
    ? []
    : Array.from(new Set(selectedIds.map((value) => Number(value)).filter((id) => id > 0)));
  const query = new URLSearchParams();
  if (month) query.set("month", month);
  if (type) query.set("type", type);
  userIds.forEach((id) => query.append("user_ids[]", String(id)));
  if (saveAdminExportModalBtn) saveAdminExportModalBtn.disabled = true;
  try {
    const response = await fetch(`/api/admin/export/alterdata?${query.toString()}`, {
      method: "GET",
      credentials: "same-origin",
      headers: adminAuthHeaders({ Accept: "text/plain" }),
    });
    if (!response.ok) {
      const payload = await safeJson(response, {});
      const errorCode = String(payload?.error_code || "").trim();
      if (errorCode === "month_not_closed") {
        const blockedIds = Array.isArray(payload?.user_ids)
          ? payload.user_ids.map((value) => Number(value)).filter((id) => id > 0)
          : userIds;
        selectedAdminCloseMonth = normalizeMonthValue(String(payload?.month || month || "")) || monthRange();
        selectedAdminCloseMonthUserKeys = blockedIds.length ? blockedIds.map((id) => String(id)) : ["all"];
        await closeAdminExportModal();
        await openAdminCloseMonthModal({
          month: selectedAdminCloseMonth,
          userKeys: selectedAdminCloseMonthUserKeys,
        });
      } else if (errorCode === "month_has_pending_entries") {
        await closeAdminExportModal();
        await openAdminPendingEntriesModal();
      }
      showError(String(payload?.error || "Não foi possível exportar o arquivo Alterdata."));
      return;
    }
    const blob = await response.blob();
    const header = String(response.headers.get("content-disposition") || "");
    const match = header.match(/filename=\"?([^\";]+)\"?/i);
    const fileName = match ? match[1] : `alterdata-${month || "geral"}.txt`;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    showInfo("Arquivo Alterdata exportado.");
    await closeAdminExportModal();
  } catch {
    showError("Falha de rede ao exportar arquivo Alterdata.");
  } finally {
    if (saveAdminExportModalBtn) saveAdminExportModalBtn.disabled = false;
  }
}

async function openAdminCategoryTypeModal() {
  renderAdminCategoryTypeList();
  await adminCategoryTypeModal?.present();
}

async function closeAdminCategoryTypeModal() {
  try {
    await adminCategoryTypeModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminUserRoleModal() {
  renderAdminUserRoleList();
  await adminUserRoleModal?.present();
}

async function closeAdminUserRoleModal() {
  try {
    await adminUserRoleModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminCloseMonthDateModal() {
  const value = normalizeMonthValue(selectedAdminCloseMonth || monthRange()) || monthRange();
  if (adminCloseMonthDatePicker) adminCloseMonthDatePicker.value = `${value}-01`;
  await adminCloseMonthDateModal?.present();
}

async function closeAdminCloseMonthDateModal() {
  try {
    await adminCloseMonthDateModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminCloseMonthUserModal() {
  const users = adminUsersCache.length ? adminUsersCache : await fetchAdminUsers();
  renderAdminUsersCheckboxes(users);
  await adminCloseMonthUserModal?.present();
}

async function closeAdminCloseMonthUserModal() {
  try {
    await adminCloseMonthUserModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminExportMonthModal() {
  const value = normalizeMonthValue(selectedAdminExportMonth || monthRange()) || monthRange();
  if (adminExportMonthPicker) adminExportMonthPicker.value = `${value}-01`;
  await adminExportMonthModal?.present();
}

async function closeAdminExportMonthModal() {
  try {
    await adminExportMonthModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminExportTypeModal() {
  renderAdminExportTypeList();
  await adminExportTypeModal?.present();
}

async function closeAdminExportTypeModal() {
  try {
    await adminExportTypeModal?.dismiss();
  } catch {
    // no-op
  }
}

async function openAdminExportUserModal() {
  const users = adminUsersCache.length ? adminUsersCache : await fetchAdminUsers();
  renderAdminExportUsersList(users);
  await adminExportUserModal?.present();
}

async function closeAdminExportUserModal() {
  try {
    await adminExportUserModal?.dismiss();
  } catch {
    // no-op
  }
}

async function loadDashboard() {
  hideMessages();
  if (refreshBtn) refreshBtn.disabled = true;

  if (!categories.length) {
    await loadCategories();
  }
  normalizeAppliedEntryFilters();
  formatFilterPanel();

  const month = monthRange();
  const prevMonth = previousMonthRange(month);
  const groupsQuery = buildEntriesGroupsQueryString(entryFilters, entriesSearchTerm);
  if (periodEl) periodEl.textContent = `Per\u00edodo: ${periodLabel()}`;

  try {
    const profileRes = await authFetch("/api/account/profile");
    if (profileRes.status === 401) {
      window.location.href = "/";
      return;
    }
    if (!profileRes.ok) {
      showError("N\u00e3o foi poss\u00edvel carregar o perfil da sess\u00e3o.");
      return;
    }
    const profile = await safeJson(profileRes, {});
    const displayName = profile?.name || profile?.email || "Usu\u00e1rio";
    const impersonationPayload = profile?.impersonation && typeof profile.impersonation === "object"
      ? profile.impersonation
      : { active: false };
    currentProfile = {
      id: Number(profile?.id || 0),
      name: String(profile?.name || ""),
      email: String(profile?.email || ""),
      role: String(profile?.role || ""),
      alterdataCode: String(profile?.alterdata_code || ""),
      impersonation: {
        active: Boolean(impersonationPayload?.active),
        admin: impersonationPayload?.admin || null,
      },
    };
    if (!currentProfile.impersonation.active) {
      try {
        localStorage.removeItem(IMPERSONATION_ADMIN_TOKEN_KEY);
      } catch {
        // ignore storage errors
      }
    }
    if (userTitleEl) userTitleEl.textContent = displayName;
    syncAdminAreaAccess();
    syncImpersonationBanner();
    syncDashMenuUserSummary();
    void loadNotifications();
    if (String(currentProfile?.role || "") === "admin" || Boolean(currentProfile?.impersonation?.active)) {
      void fetchAdminPendingEntries().then((items) => {
        syncAdminPendingEntriesBadge(Array.isArray(items) ? items.length : 0);
      });
    } else {
      syncAdminPendingEntriesBadge(0);
    }

    const [monthAggRes, prevMonthAggRes, summaryRes, entriesRes, entryGroupsRes] = await Promise.all([
      authFetch(`/api/reports/aggregate?start=${month}&end=${month}`),
      authFetch(`/api/reports/aggregate?start=${prevMonth}&end=${prevMonth}`),
      authFetch("/api/reports/summary"),
      authFetch("/api/entries"),
      authFetch(`/api/reports/entries-groups?${groupsQuery}`),
    ]);

    if ([monthAggRes, prevMonthAggRes, summaryRes, entriesRes, entryGroupsRes].some((response) => response.status === 401)) {
      window.location.href = "/";
      return;
    }
    if ([monthAggRes, prevMonthAggRes, summaryRes, entriesRes, entryGroupsRes].some((response) => !response.ok)) {
      showError("N\u00e3o foi poss\u00edvel carregar o dashboard.");
      return;
    }

    const [monthAgg, prevMonthAgg, summary, entries, groupedPayload] = await Promise.all([
      safeJson(monthAggRes, {}),
      safeJson(prevMonthAggRes, {}),
      safeJson(summaryRes, {}),
      safeJson(entriesRes, []),
      safeJson(entryGroupsRes, {}),
    ]);

    dashboardEntriesCache = Array.isArray(entries) ? entries : [];
    const monthAggSafe = (monthAgg && typeof monthAgg === "object") ? monthAgg : {};
    const prevMonthAggSafe = (prevMonthAgg && typeof prevMonthAgg === "object") ? prevMonthAgg : {};
    const monthAggEmpty = !Array.isArray(monthAggSafe.by_category) || monthAggSafe.by_category.length === 0;
    const prevMonthAggEmpty = !Array.isArray(prevMonthAggSafe.by_category) || prevMonthAggSafe.by_category.length === 0;
    if (monthAggEmpty || !Array.isArray(monthAggSafe.by_account) || monthAggSafe.by_account.length === 0) {
      Object.assign(monthAggSafe, buildMonthAggregateFromEntries(dashboardEntriesCache, month));
    }
    if (prevMonthAggEmpty || !Array.isArray(prevMonthAggSafe.by_account) || prevMonthAggSafe.by_account.length === 0) {
      Object.assign(prevMonthAggSafe, buildMonthAggregateFromEntries(dashboardEntriesCache, prevMonth));
    }

    const totals = monthAggSafe?.totals || {};
    const balance = Number(totals.balance || 0);
    const totalIn = Number(totals.in || 0);
    const totalOut = Number(totals.out || 0);

    if (kpiBalance) kpiBalance.textContent = money.format(balance);
    if (balanceHeadEl) {
      balanceHeadEl.textContent = money.format(balance);
      balanceHeadEl.className = `topbar-balance__value ${toAmountClass(balance)}`.trim();
    }
    if (budgetLine) budgetLine.textContent = `${money.format(totalIn + totalOut)} or\u00e7ado no m\u00eas`;

    const trend = Number((summary?.last_12_months || []).slice(-1)[0]?.month_balance || 0);
    const trendPrefix = trend >= 0 ? "+" : "-";
    if (trendLabel) trendLabel.textContent = `Resultado do m\u00eas ${trendPrefix} ${money.format(Math.abs(trend))}`;
    if (trendLine) trendLine.setAttribute("points", polylinePoints(summary?.last_12_months || []));

    const entryGroups = Array.isArray(groupedPayload?.groups) ? groupedPayload.groups : [];
    const groupedEntries = extractEntriesFromGroups(entryGroups);
    if (groupedEntries.length) {
      Object.assign(monthAggSafe, buildMonthAggregateFromEntries(groupedEntries, month));
    }
    renderEntriesGroupedFromServer(entriesList, entryGroups, "Nenhum lan\u00e7amento encontrado.");
    if (entriesMetaEl) {
      const count = Number(groupedPayload?.count || 0);
      entriesMetaEl.textContent = count === 1 ? "1 lan\u00e7amento" : `${count} lan\u00e7amentos`;
    }

    try {
      const pendingEntries = Array.isArray(entries)
        ? entries.filter((entry) => Number(entry.needs_review || 0) === 1).slice(0, 3)
        : [];
      renderRows(reviewList, pendingEntries, "review", "Tudo revisado por enquanto.");
      if (reviewActionEl) reviewActionEl.hidden = pendingEntries.length === 0;

      const today = todayIsoDate();
      const nextEntries = Array.isArray(entries)
        ? entries
            .filter((entry) => entry.type === "out" && (entry.date || "") >= today)
            .sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
            .slice(0, 3)
        : [];
      renderRows(nextList, nextEntries, "next", "Nenhum lan\u00e7amento futuro.");
      renderCategories(monthAggSafe?.by_category || []);
      renderCategoriesTab(monthAggSafe || {}, prevMonthAggSafe || {});
      renderAccountsTab(monthAggSafe || {}, prevMonthAggSafe || {});
      renderTopSummaryForTab(activeTabName());
    } catch (sectionError) {
      console.error("Erro ao renderizar se\u00e7\u00f5es secund\u00e1rias do dashboard:", sectionError);
    }

    await loadCategories();
    await loadAccounts(true);
    await loadRecurrences();
    showInfo(`Atualizado com dados de ${periodLabel()}`);
    requestAnimationFrame(updateOverlayPositioning);
  } catch (error) {
    console.error("Erro ao carregar dashboard:", error);
    showError("Falha ao processar os dados do dashboard.");
  } finally {
    if (initialBootPending) {
      initialBootPending = false;
      if (window.__dashboardLoading && typeof window.__dashboardLoading.finishWithSlide === "function") {
        window.__dashboardLoading.finishWithSlide(500, 420);
      } else {
        window.setTimeout(() => {
          if (!rootApp) return;
          rootApp.classList.add("is-boot-exiting");
          window.setTimeout(() => {
            setInitialLoading(false);
          }, 420);
        }, 500);
      }
    }
    if (refreshBtn) refreshBtn.disabled = false;
  }
}

async function logout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
      headers: authHeaders({ Accept: "application/json" }),
    });
  } finally {
    setStoredAuthToken("");
    try {
      localStorage.removeItem(IMPERSONATION_ADMIN_TOKEN_KEY);
    } catch {
      // ignore storage errors
    }
    window.location.href = "/";
  }
}

logoutBtn?.addEventListener("click", () => {
  void logout();
});

notificationsMenuBtn?.addEventListener("click", () => {
  void openNotificationsModal();
});

supportMenuBtn?.addEventListener("click", () => {
  void openSupportModal();
});

profileMenuBtn?.addEventListener("click", () => {
  void openProfileModal();
});

passwordMenuBtn?.addEventListener("click", () => {
  void openPasswordModal();
});

adminMenuBtn?.addEventListener("click", () => {
  showTab("administracao");
});

adminActionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = String(button.getAttribute("data-admin-action") || "");
    if (action === "global-categories") {
      void openAdminCategoriesModal();
      return;
    }
    if (action === "users") {
      void openAdminUsersModal();
      return;
    }
    if (action === "pending-entries") {
      void openAdminPendingEntriesModal();
      return;
    }
    if (action === "impersonate-user") {
      void openAdminImpersonateModal();
      return;
    }
    if (action === "close-month") {
      void openAdminCloseMonthModal();
      return;
    }
    if (action === "export-alterdata") {
      void openAdminExportModal();
      return;
    }
    if (action === "alterdata-config") {
      void openAdminAlterdataConfigModal();
      return;
    }
    if (adminInfoEl) {
      adminInfoEl.textContent = "Selecione uma ação para continuar.";
    }
  });
});

closeNotificationsModalBtn?.addEventListener("click", () => {
  void closeNotificationsModal();
});

notificationsListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-notification-index]");
  if (!btn) return;
  const index = Number(btn.getAttribute("data-notification-index") || -1);
  if (index < 0) return;
  const item = notificationsCache[index];
  if (!item) return;
  void handleNotificationSelection(item);
});

closeSupportModalBtn?.addEventListener("click", () => {
  void closeSupportModal();
});

openSupportThreadPickerBtn?.addEventListener("click", () => {
  void openSupportThreadModal();
});

closeSupportThreadModalBtn?.addEventListener("click", () => {
  void closeSupportThreadModal();
});

supportThreadListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-support-thread-id]");
  if (!btn) return;
  const id = Number(btn.getAttribute("data-support-thread-id") || 0);
  if (id <= 0) return;
  selectedSupportThreadId = id;
  syncSupportThreadLabel();
  renderSupportThreadList();
  void closeSupportThreadModal().then(() => loadSupportMessages());
});

openSupportAttachModalBtn?.addEventListener("click", () => {
  void openSupportAttachModal();
});

closeSupportAttachModalBtn?.addEventListener("click", () => {
  void closeSupportAttachModal();
});

supportAttachListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-support-attach-key]");
  if (!btn) return;
  const key = String(btn.getAttribute("data-support-attach-key") || "");
  if (!key) return;
  if (key === "file") {
    if (supportAttachmentFileInput) supportAttachmentFileInput.click();
    void closeSupportAttachModal();
    return;
  }
  void closeSupportAttachModal().then(() => openSupportEntityModal(key));
});

supportAttachmentFileInput?.addEventListener("change", async () => {
  const file = supportAttachmentFileInput.files?.[0];
  if (!file) return;
  const uploaded = await uploadSupportAttachment(file);
  if (!uploaded) return;
  supportAttachmentDraft = {
    type: "screenshot",
    path: String(uploaded.path || ""),
    title: String(file.name || "Imagem"),
  };
  syncSupportAttachmentPreview();
});

clearSupportAttachmentBtn?.addEventListener("click", () => {
  clearSupportAttachmentDraft();
});

supportRecordAudioBtn?.addEventListener("click", () => {
  void toggleSupportAudioRecording();
});

supportSendMessageBtn?.addEventListener("click", () => {
  void submitSupportMessage();
});

supportMessageInput?.addEventListener("keydown", (event) => {
  if (!event || event.shiftKey) return;
  if (event.key === "Enter") {
    event.preventDefault();
    void submitSupportMessage();
  }
});

closeSupportEntityModalBtn?.addEventListener("click", () => {
  void closeSupportEntityModal();
});

supportEntitySearchInput?.addEventListener("ionInput", () => {
  renderSupportEntityList();
});

supportEntityListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-support-entity-id]");
  if (!btn) return;
  const id = Number(btn.getAttribute("data-support-entity-id") || 0);
  if (id <= 0) return;
  const row = supportEntityPickerRows.find((item) => Number(item?.id || 0) === id);
  supportAttachmentDraft = {
    type: supportEntityPickerType,
    ref_type: supportEntityPickerType,
    ref_id: id,
    title: String(row?.title || "Referência"),
  };
  syncSupportAttachmentPreview();
  void closeSupportEntityModal();
});

supportMessagesEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const pathBtn = target.closest("[data-support-open-path]");
  if (pathBtn) {
    const encoded = String(pathBtn.getAttribute("data-support-open-path") || "");
    const path = encoded ? decodeURIComponent(encoded) : "";
    void openSupportAttachmentPath(path);
    return;
  }
  const refBtn = target.closest("[data-support-open-ref-type]");
  if (!refBtn) return;
  const refType = String(refBtn.getAttribute("data-support-open-ref-type") || "");
  const refId = Number(refBtn.getAttribute("data-support-open-ref-id") || 0);
  if (!refType || refId <= 0) return;
  void openSupportEntityReference(refType, refId);
});

closeProfileModalBtn?.addEventListener("click", () => {
  void closeProfileModal();
});

cancelProfileModalBtn?.addEventListener("click", () => {
  void closeProfileModal();
});

saveProfileModalBtn?.addEventListener("click", () => {
  void saveProfilePreferences();
});

closePasswordModalBtn?.addEventListener("click", () => {
  void closePasswordModal();
});

cancelPasswordModalBtn?.addEventListener("click", () => {
  void closePasswordModal();
});

savePasswordModalBtn?.addEventListener("click", () => {
  void saveAccountPassword();
});

closeAdminCategoriesModalBtn?.addEventListener("click", () => {
  void closeAdminCategoriesModal();
});
cancelAdminCategoriesModalBtn?.addEventListener("click", () => {
  void closeAdminCategoriesModal();
});
saveAdminCategoryModalBtn?.addEventListener("click", () => {
  void saveAdminCategory();
});
openAdminCategoryEditorNewBtn?.addEventListener("click", () => {
  resetAdminCategoryForm();
  void openAdminCategoryEditorModal();
});
closeAdminCategoryEditorModalBtn?.addEventListener("click", () => {
  void closeAdminCategoryEditorModal();
});
cancelAdminCategoryEditorModalBtn?.addEventListener("click", () => {
  void closeAdminCategoryEditorModal();
});
deleteAdminCategoryModalBtn?.addEventListener("click", () => {
  if (editingAdminCategoryId > 0) {
    void deleteAdminCategory(editingAdminCategoryId);
  }
});
openAdminCategoryTypeBtn?.addEventListener("click", () => {
  void openAdminCategoryTypeModal();
});
closeAdminCategoryTypeModalBtn?.addEventListener("click", () => {
  void closeAdminCategoryTypeModal();
});

adminCategoriesListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const selectBtn = target.closest("[data-admin-category-select]");
  const selectedIdRaw = selectBtn ? selectBtn.getAttribute("data-admin-category-select") : "";
  if (!selectedIdRaw) return;
  const id = Number(selectedIdRaw);
  const item = adminCategoriesCache.find((row) => Number(row?.id || 0) === id);
  if (!item) return;
  editingAdminCategoryId = id;
  if (adminCategoryNameInput) adminCategoryNameInput.value = String(item?.name || "");
  selectedAdminCategoryType = String(item?.type || "out");
  syncAdminCategoryTypeLabel();
  if (adminCategoryAlterdataInput) adminCategoryAlterdataInput.value = String(item?.alterdata_auto || "");
  if (deleteAdminCategoryModalBtn) deleteAdminCategoryModalBtn.hidden = false;
  void openAdminCategoryEditorModal();
  void fetchAdminCategoryStats(id).then(renderAdminCategoryStats);
});

adminCategoryTypeListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-admin-category-type]");
  const value = btn ? String(btn.getAttribute("data-admin-category-type") || "") : "";
  if (!value) return;
  selectedAdminCategoryType = value;
  syncAdminCategoryTypeLabel();
  void closeAdminCategoryTypeModal();
});

closeAdminUsersModalBtn?.addEventListener("click", () => {
  void closeAdminUsersModal();
});
cancelAdminUsersModalBtn?.addEventListener("click", () => {
  void closeAdminUsersModal();
});
closeAdminPendingEntriesModalBtn?.addEventListener("click", () => {
  void closeAdminPendingEntriesModal();
});
cancelAdminPendingEntriesModalBtn?.addEventListener("click", () => {
  void closeAdminPendingEntriesModal();
});
closeAdminImpersonateModalBtn?.addEventListener("click", () => {
  void closeAdminImpersonateModal();
});
cancelAdminImpersonateModalBtn?.addEventListener("click", () => {
  void closeAdminImpersonateModal();
});
saveAdminImpersonateModalBtn?.addEventListener("click", () => {
  if (selectedAdminImpersonateUserId > 0) {
    void impersonateAdminUser(selectedAdminImpersonateUserId);
  }
});
saveAdminUserModalBtn?.addEventListener("click", () => {
  void saveAdminUser();
});
openAdminUserEditorNewBtn?.addEventListener("click", () => {
  resetAdminUserForm();
  void openAdminUserEditorModal();
});
closeAdminUserEditorModalBtn?.addEventListener("click", () => {
  void closeAdminUserEditorModal();
});
cancelAdminUserEditorModalBtn?.addEventListener("click", () => {
  void closeAdminUserEditorModal();
});
openAdminUserRoleBtn?.addEventListener("click", () => {
  void openAdminUserRoleModal();
});
closeAdminUserRoleModalBtn?.addEventListener("click", () => {
  void closeAdminUserRoleModal();
});

adminUsersListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const selectBtn = target.closest("[data-admin-user-select]");
  const selectedIdRaw = selectBtn ? selectBtn.getAttribute("data-admin-user-select") : "";
  if (!selectedIdRaw) return;
  const id = Number(selectedIdRaw);
  const item = adminUsersCache.find((row) => Number(row?.id || 0) === id);
  if (!item) return;
  editingAdminUserId = id;
  if (adminUserNameInput) adminUserNameInput.value = String(item?.name || "");
  if (adminUserEmailInput) adminUserEmailInput.value = String(item?.email || "");
  if (adminUserPasswordInput) adminUserPasswordInput.value = "";
  selectedAdminUserRole = String(item?.role || "user");
  syncAdminUserRoleLabel();
  if (adminUserAlterdataInput) adminUserAlterdataInput.value = String(item?.alterdata_code || "");
  if (deleteAdminUserModalBtn) deleteAdminUserModalBtn.hidden = false;
  void openAdminUserEditorModal();
  void fetchAdminUserStats(id).then(renderAdminUserStats);
});

adminPendingEntriesListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const button = target.closest("[data-admin-pending-entry-id]");
  if (!button) return;
  const id = Number(button.getAttribute("data-admin-pending-entry-id") || 0);
  if (id <= 0) return;
  const item = adminPendingEntriesCache.find((entry) => Number(entry?.id || 0) === id);
  if (!item) return;
  loadedEntriesIndex.set(id, item);
  void closeAdminPendingEntriesModal().then(() => openEntryEditor(id));
});

adminImpersonateListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-admin-impersonate-user-id]");
  if (!btn) return;
  const id = Number(btn.getAttribute("data-admin-impersonate-user-id") || 0);
  if (id <= 0) return;
  selectedAdminImpersonateUserId = id;
  renderAdminImpersonateUsersList(adminUsersCache);
  if (saveAdminImpersonateModalBtn) saveAdminImpersonateModalBtn.disabled = false;
});

adminUserRoleListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-admin-user-role]");
  const value = btn ? String(btn.getAttribute("data-admin-user-role") || "") : "";
  if (!value) return;
  selectedAdminUserRole = value;
  syncAdminUserRoleLabel();
  void closeAdminUserRoleModal();
});

closeAdminCloseMonthModalBtn?.addEventListener("click", () => {
  void closeAdminCloseMonthModal();
});
cancelAdminCloseMonthModalBtn?.addEventListener("click", () => {
  void closeAdminCloseMonthModal();
});
saveAdminCloseMonthModalBtn?.addEventListener("click", () => {
  void submitAdminCloseMonth();
});
openAdminCloseMonthDateBtn?.addEventListener("click", () => {
  void openAdminCloseMonthDateModal();
});
closeAdminCloseMonthDateModalBtn?.addEventListener("click", () => {
  void closeAdminCloseMonthDateModal();
});
openAdminCloseMonthUsersBtn?.addEventListener("click", () => {
  void openAdminCloseMonthUserModal();
});
closeAdminCloseMonthUserModalBtn?.addEventListener("click", () => {
  void closeAdminCloseMonthUserModal();
});
adminCloseMonthDatePicker?.addEventListener("ionChange", (event) => {
  const value = normalizeMonthValue(event?.detail?.value || "");
  if (!value) return;
  selectedAdminCloseMonth = value;
  syncAdminCloseMonthLabel();
});
adminCloseMonthUsersEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-admin-close-user-id]");
  const rawValue = String(btn ? btn.getAttribute("data-admin-close-user-id") : "");
  if (!rawValue) return;
  if (rawValue === "all") {
    selectedAdminCloseMonthUserKeys = ["all"];
    renderAdminUsersCheckboxes(adminUsersCache);
    syncAdminCloseMonthLabel();
    return;
  }
  const id = String(Number(rawValue) || 0);
  if (id === "0") return;
  const next = new Set((Array.isArray(selectedAdminCloseMonthUserKeys) ? selectedAdminCloseMonthUserKeys : ["all"]).map((value) => String(value || "")));
  next.delete("all");
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedAdminCloseMonthUserKeys = next.size ? Array.from(next) : ["all"];
  renderAdminUsersCheckboxes(adminUsersCache);
  syncAdminCloseMonthLabel();
});

closeAdminExportModalBtn?.addEventListener("click", () => {
  void closeAdminExportModal();
});
cancelAdminExportModalBtn?.addEventListener("click", () => {
  void closeAdminExportModal();
});
saveAdminExportModalBtn?.addEventListener("click", () => {
  void submitAdminExport();
});
openAdminExportMonthBtn?.addEventListener("click", () => {
  void openAdminExportMonthModal();
});
closeAdminExportMonthModalBtn?.addEventListener("click", () => {
  void closeAdminExportMonthModal();
});
adminExportMonthPicker?.addEventListener("ionChange", (event) => {
  const value = normalizeMonthValue(event?.detail?.value || "");
  if (!value) return;
  selectedAdminExportMonth = value;
  syncAdminExportLabels();
});
openAdminExportTypeBtn?.addEventListener("click", () => {
  void openAdminExportTypeModal();
});
closeAdminExportTypeModalBtn?.addEventListener("click", () => {
  void closeAdminExportTypeModal();
});
adminExportTypeListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-admin-export-type]");
  const value = btn ? String(btn.getAttribute("data-admin-export-type") || "") : "";
  if (!value) return;
  selectedAdminExportType = value;
  syncAdminExportLabels();
  void closeAdminExportTypeModal();
});
openAdminExportUserBtn?.addEventListener("click", () => {
  void openAdminExportUserModal();
});
closeAdminExportUserModalBtn?.addEventListener("click", () => {
  void closeAdminExportUserModal();
});
adminExportUserListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-admin-export-user-id]");
  if (!btn) return;
  const rawValue = String(btn.getAttribute("data-admin-export-user-id") || "");
  if (!rawValue) return;
  if (rawValue === "all") {
    selectedAdminExportUserIds = ["all"];
    renderAdminExportUsersList(adminUsersCache);
    syncAdminExportLabels();
    return;
  }
  const id = String(Number(rawValue) || 0);
  if (id === "0") return;
  const next = new Set((Array.isArray(selectedAdminExportUserIds) ? selectedAdminExportUserIds : ["all"]).map((value) => String(value || "")));
  next.delete("all");
  if (next.has(id)) next.delete(id);
  else next.add(id);
  selectedAdminExportUserIds = next.size ? Array.from(next) : ["all"];
  renderAdminExportUsersList(adminUsersCache);
  syncAdminExportLabels();
});

closeAdminAlterdataConfigModalBtn?.addEventListener("click", () => {
  void closeAdminAlterdataConfigModal();
});
cancelAdminAlterdataConfigModalBtn?.addEventListener("click", () => {
  void closeAdminAlterdataConfigModal();
});
adminAlterdataConfigListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-admin-alterdata-column]");
  if (!btn) return;
  const column = String(btn.getAttribute("data-admin-alterdata-column") || "").trim().toUpperCase();
  if (!column) return;
  void openAdminAlterdataColumnModal(column);
});
closeAdminAlterdataColumnModalBtn?.addEventListener("click", () => {
  void closeAdminAlterdataColumnModal();
});
cancelAdminAlterdataColumnModalBtn?.addEventListener("click", () => {
  void closeAdminAlterdataColumnModal();
});
saveAdminAlterdataColumnModalBtn?.addEventListener("click", () => {
  void saveAdminAlterdataColumnConfig();
});
openAdminAlterdataSourceModalBtn?.addEventListener("click", () => {
  void openAdminAlterdataSourceModal();
});
openAdminAlterdataFieldModalBtn?.addEventListener("click", () => {
  void openAdminAlterdataFieldModal();
});
closeAdminAlterdataSourceModalBtn?.addEventListener("click", () => {
  void closeAdminAlterdataSourceModal();
});
adminAlterdataSourceListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-admin-alterdata-source]");
  if (!btn) return;
  const scope = String(btn.getAttribute("data-admin-alterdata-source") || "").trim();
  if (!scope) return;
  selectedAdminAlterdataSourceScope = scope;
  const allowed = Array.isArray(adminAlterdataAllowedFields?.[scope]) ? adminAlterdataAllowedFields[scope] : [];
  if (!allowed.includes(selectedAdminAlterdataSourceField)) {
    selectedAdminAlterdataSourceField = String(allowed[0] || "");
  }
  syncAdminAlterdataColumnEditor();
  renderAdminAlterdataSourceList();
  renderAdminAlterdataFieldList();
  void closeAdminAlterdataSourceModal();
});
closeAdminAlterdataFieldModalBtn?.addEventListener("click", () => {
  void closeAdminAlterdataFieldModal();
});
adminAlterdataFieldListEl?.addEventListener("click", (event) => {
  const target = event.target instanceof HTMLElement ? event.target : null;
  if (!target) return;
  const btn = target.closest("[data-admin-alterdata-field]");
  if (!btn) return;
  const field = String(btn.getAttribute("data-admin-alterdata-field") || "").trim();
  if (!field) return;
  selectedAdminAlterdataSourceField = field;
  syncAdminAlterdataColumnEditor();
  renderAdminAlterdataFieldList();
  void closeAdminAlterdataFieldModal();
});

notificationsModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
notificationsModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

supportModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
supportModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

supportThreadModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
supportThreadModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

supportAttachModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
supportAttachModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

supportEntityModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
supportEntityModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

profileModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
profileModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

passwordModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
passwordModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminCategoriesModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminCategoriesModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminCategoryEditorModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminCategoryEditorModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminUsersModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminUsersModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminPendingEntriesModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminPendingEntriesModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminImpersonateModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminImpersonateModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminUserEditorModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminUserEditorModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminCloseMonthModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminCloseMonthModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminExportModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminExportModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminCategoryTypeModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminCategoryTypeModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminUserRoleModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminUserRoleModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminCloseMonthDateModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminCloseMonthDateModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminCloseMonthUserModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminCloseMonthUserModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminExportMonthModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminExportMonthModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminExportTypeModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminExportTypeModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

adminExportUserModal?.addEventListener("ionModalDidDismiss", () => {
  refreshPickerLayerState();
});
adminExportUserModal?.addEventListener("ionModalDidPresent", () => {
  refreshPickerLayerState();
});

refreshBtn?.addEventListener("click", () => {
  void loadDashboard();
});

stopImpersonationBtn?.addEventListener("click", () => {
  void stopImpersonation();
});

selectedAdminCloseMonth = monthRange();
selectedAdminExportMonth = monthRange();
syncAdminCategoryTypeLabel();
syncAdminUserRoleLabel();
syncAdminCloseMonthLabel();
syncAdminExportLabels();

setupTabNav();
setupEntryModal();
setupRecurrenceInteractions();
setupConfirmActionModal();
initEntryFilters();
formatFilterPanel();
setupEntriesInteractions();
setInitialLoading(true);
requestAnimationFrame(updateOverlayPositioning);
void loadDashboard();








  if (deleteAdminUserModalBtn) deleteAdminUserModalBtn.hidden = true;
      if (deleteAdminUserModalBtn) deleteAdminUserModalBtn.hidden = false;
deleteAdminUserModalBtn?.addEventListener("click", () => {
  if (editingAdminUserId > 0) {
    void deleteAdminUser(editingAdminUserId);
  }
});
