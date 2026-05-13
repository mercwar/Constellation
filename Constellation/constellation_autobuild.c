/* FILE: constellation_autobuild.c */
/* PATH: /Constellation/constellation_autobuild.c */

/* ------------------------------------------------------------
   AVIS.HEADER
   ROLE: CONSTELLATION_AUTOBUILD
   PURPOSE: Automatically detects new Constellation versions,
            compiles them, and prepares the repo for future
            upgrades without manual intervention.
   AUTHOR: Demon
   NOTES: This is the THIRD CONSTELLATION PROGRAM. It completes
          the intelligence chain: scan → reduce → autobuild.
   ------------------------------------------------------------ */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>

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
   FUNCTION: is_version_folder
   PURPOSE: Detects version folder naming patterns
   ------------------------------------------------------------ */
int is_version_folder(const char *name) {
    if (strncmp(name, "v", 1) == 0) return 1;
    if (strncmp(name, "version", 7) == 0) return 1;
    if (strchr(name, '.') != NULL) return 1;
    return 0;
}

/* ------------------------------------------------------------
   FUNCTION: scan_versions
   PURPOSE: Scans a Constellation folder for version folders
            and version files.
   ------------------------------------------------------------ */
int scan_versions(const char *path, VersionEntry versions[], int *count) {
    DIR *dir = opendir(path);
    if (!dir) {
        printf("No Constellation folder found: %s\n", path);
        return 0;
    }

    struct dirent *entry;
    char fullPath[MAX_PATH];

    while ((entry = readdir(dir)) != NULL) {

        if (strcmp(entry->d_name, ".") == 0 ||
            strcmp(entry->d_name, "..") == 0)
            continue;

        snprintf(fullPath, sizeof(fullPath), "%s/%s", path, entry->d_name);

        if (entry->d_type == DT_DIR && is_version_folder(entry->d_name)) {
            strcpy(versions[*count].path, fullPath);
            strcpy(versions[*count].name, entry->d_name);
            (*count)++;
        }

        if (entry->d_type == DT_REG && strstr(entry->d_name, ".version")) {
            strcpy(versions[*count].path, fullPath);
            strcpy(versions[*count].name, entry->d_name);
            (*count)++;
        }
    }

    closedir(dir);
    return 1;
}

/* ------------------------------------------------------------
   FUNCTION: compile_version
   PURPOSE: Compiles a version folder or version file
   ------------------------------------------------------------ */
void compile_version(const VersionEntry *v) {
    printf("COMPILING VERSION: %s\n", v->name);

    char cmd[MAX_PATH * 2];
    snprintf(cmd, sizeof(cmd),
             "gcc -o %s.bin %s/*.c 2>/dev/null",
             v->name, v->path);

    system(cmd);
}

/* ------------------------------------------------------------
   FUNCTION: autobuild
   PURPOSE: Automatically compiles all versions in order
   ------------------------------------------------------------ */
void autobuild(const char *repoPath) {
    char constellationPath[MAX_PATH];
    snprintf(constellationPath, sizeof(constellationPath),
             "%s/Constellation", repoPath);

    VersionEntry versions[MAX_VERSIONS];
    int count = 0;

    if (!scan_versions(constellationPath, versions, &count)) {
        printf("No versions found.\n");
        return;
    }

    printf("Found %d version entries.\n", count);

    for (int i = 0; i < count; i++) {
        compile_version(&versions[i]);
    }

    printf("AutoBuild complete.\n");
}

/* ------------------------------------------------------------
   MAIN PROGRAM
   PURPOSE: Entry point for the Constellation AutoBuild Engine
   ------------------------------------------------------------ */
int main(int argc, char *argv[]) {

    if (argc < 2) {
        printf("Usage: constellation_autobuild <repo-path>\n");
        return 1;
    }

    printf("Starting AutoBuild for repo: %s\n", argv[1]);

    autobuild(argv[1]);

    return 0;
}
