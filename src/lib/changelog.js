/**
 * Parses a changelog markdown string into a structured format.
 * @param {string} markdown - The changelog markdown content.
 * @returns {Array} An array of release objects with version, date, and changes.
 */
export function parseChangelog(markdown) {
  const releases = [];
  let release = null;
  let group = null;

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    const releaseMatch = line.match(/^## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})$/);
    const groupMatch = line.match(/^### (Added|Changed|Fixed|Deprecated|Removed|Security|Thêm|Thay đổi|Sửa lỗi|Đã sửa|Ngừng hỗ trợ|Xóa|Bảo mật)$/i);
    const itemMatch = line.match(/^- (.+)$/);

    if (releaseMatch) {
      release = { version: releaseMatch[1], date: releaseMatch[2], changes: {} };
      releases.push(release);
      group = null;
    } else if (groupMatch && release) {
      const groupNames = { thêm: "added", "thay đổi": "changed", "sửa lỗi": "fixed", "đã sửa": "fixed", "ngừng hỗ trợ": "deprecated", "xóa": "removed", "bảo mật": "security" };
      group = groupNames[groupMatch[1].toLowerCase()] || groupMatch[1].toLowerCase();
      release.changes[group] = [];
    } else if (itemMatch && release && group) {
      release.changes[group].push(itemMatch[1]);
    }
  }

  return releases;
}

/**
 * Fetches the changelog markdown from a given URL and parses it.
 * @param {string} url - The URL to fetch the changelog from.
 * @returns {Promise<Array>} A promise that resolves to an array of release objects.
 */
const changelogPromises = new Map();

export async function fetchChangelog(url = "./CHANGELOG.md") {
  if (!changelogPromises.has(url)) {
    const promise = fetch(url, { cache: "no-cache" })
      .then((response) => {
        if (!response.ok) throw new Error("Không thể tải lịch sử cập nhật.");
        return response.text();
      })
      .then(parseChangelog)
      .catch((error) => {
        changelogPromises.delete(url);
        throw error;
      });
    changelogPromises.set(url, promise);
  }
  return changelogPromises.get(url);
}
