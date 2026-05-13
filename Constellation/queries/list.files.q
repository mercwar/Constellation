# FILE: list.files.q
# PATH: /Constellation/queries/list.files.q

# ------------------------------------------------------------
# AVIS.HEADER
# ROLE: QUERY_DEFINITION
# PURPOSE: Returns all files inside a given repo mirror
# AUTHOR: Demon
# NOTES: Walker uses this to determine scan targets
# ------------------------------------------------------------

[QUERY]
ACTION = LIST
TARGET = FILES
PARAM = REPO_NAME

[OUTPUT]
FORMAT = PATHS

[EXAMPLE]
INPUT = AVIS
OUTPUT = /Constellation/sources/AVIS/*
