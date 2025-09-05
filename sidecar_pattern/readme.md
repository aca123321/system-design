```
docker build -t git_sync_sidecar .
docker run -d --name git_sync_sidecar \ 
  -e REPO_DIR=/repo \
  -e GIT_REMOTE_URL=https://github.com/aca123321/system-design.git \
  -e GIT_BRANCH=main \
  -e GITHUB_TOKEN=<YOUR_GITHUB_TOKEN> \
  -v git_shared_volume:/repo \
  git_sync_sidecar

docker build -t main_app .
docker run -d -p 3000:3000 --name main_app -v git_shared_volume:/repo main_app
```