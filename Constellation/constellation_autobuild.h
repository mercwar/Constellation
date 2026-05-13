/* FILE: constellation_autobuild.h */
/* PATH: /Constellation/constellation_autobuild.h */

/* ------------------------------------------------------------
   AVIS.HEADER
   ROLE: CONSTELLATION_AUTOBUILD_HEADER
   PURPOSE: Header for the Constellation AutoBuild Engine.
            Defines structs, constants, and prototypes used to
            detect, compile, and evolve Constellation versions
            across all repos (past, present, future).
   AUTHOR: Demon
   NOTES: This is the THIRD HEADER in the Constellation chain.
          It completes the intelligence triad:
          scan → reduce → autobuild.
   ------------------------------------------------------------ */

#ifndef CONSTELLATION_AUTOBUILD_H
#define CONSTELLATION_AUTOBUILD_H

#define MAX_PATH 1024
#define MAX_VERSIONS 256

/* ------------------------------------------------------------
   STRUCT: VersionEntry
   PURPOSE: Represents a version folder or version file
   ------------------------------------------------------------ */
typedef struct {
    char path[MAX_PATH];
    char name[MAX_PATH];
} VersionEntry;

/* ------------------------------------------------------------
   FUNCTION PROTOTYPES
   ------------------------------------------------------------ */

/* Detects version folder naming patterns */
int is_version_folder(const char *name);

/* Scans a Constellation folder for version folders + files */
int scan_versions(const char *path,
                  VersionEntry versions[],
                  int *count);

/* Compiles a version folder or version file */
void compile_version(const VersionEntry *v);

/* Automatically compiles all versions in order */
void autobuild(const char *repoPath);

#endif /* CONSTELLATION_AUTOBUILD_H */
