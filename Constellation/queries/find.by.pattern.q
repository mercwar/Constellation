# FILE: find.by.pattern.q
# PATH: /Constellation/queries/find.by.pattern.q

# ------------------------------------------------------------
# AVIS.HEADER
# ROLE: QUERY_DEFINITION
# PURPOSE: Pattern-based search across repo mirrors
# AUTHOR: Demon
# NOTES: Walker uses this during deep scans
# ------------------------------------------------------------

[QUERY]
ACTION = SEARCH
TARGET = FILES
MODE = PATTERN_MATCH
PARAM = PATTERN

[EXAMPLE]
PATTERN = *.c
