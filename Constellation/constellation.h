/* FILE: constellation.h */
/* PATH: /Constellation/constellation.h */

/* ------------------------------------------------------------
   AVIS.HEADER
   ROLE: CONSTELLATION_MAIN_HEADER
   PURPOSE: Header for the Constellation C program. Defines all
            structs, constants, and function prototypes used to
            scan repos for Constellation folders and version
            structures (past, present, future).
   AUTHOR: Demon
   NOTES: This is the FIRST VERSION of the FIRST HEADER. All
          repos will eventually contain a version of this file.
   ------------------------------------------------------------ */

#ifndef CONSTELLATION_H
#define CONSTELLATION_H

#define MAX_VERSIONS 256
#define MAX_PATH 1024

/* ------------------------------------------------------------
   STRUCT: VersionEntry
   PURPOSE: Represents a version folder or root version file
   ------------------------------------------------------------ */
typedef struct {
    char path[MAX_PATH];
    char name[MAX_PATH];
} VersionEntry;

/* ------------------------------------------------------------
   FUNCTION PROTOTYPES
   ------------------------------------------------------------ */

/* Detects if a folder name looks like a version */
int is_version_folder(const char *name);

/* Scans a /Constellation folder inside ANY repo */
int scan_constellation_folder(const char *repoPath,
                              VersionEntry versions[],
                              int *count);

/* Prints all discovered versions */
void print_versions(VersionEntry versions[], int count);

#endif /* CONSTELLATION_H */
