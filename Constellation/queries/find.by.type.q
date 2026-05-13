# FILE: find.by.type.q
# PATH: /Constellation/queries/find.by.type.q

# ------------------------------------------------------------
# AVIS.HEADER
# ROLE: QUERY_DEFINITION
# PURPOSE: Returns repos by classification type
# AUTHOR: Demon
# NOTES: Nexus uses this for semantic grouping
# ------------------------------------------------------------

[QUERY]
ACTION = FIND
TARGET = REPO
FILTER = TYPE

[TYPES]
CORE
ENGINE
UI
PLAYER
SYSTEM
BROWSER
ROBOT
