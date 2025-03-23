import { PlayerConfig } from "@/interfaces/player-config";
import { INITIAL_PLAYER_CONFIG } from "@/utils/player-config-utils";
import { Box, Button, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import { sendGTMEvent } from "@next/third-parties/google";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
interface SyncPlayerConfigPanelProps {
  playerConfig: PlayerConfig;
  setPlayerConfig: (config: PlayerConfig) => void;
  downloadPlayerConfig: (nanoid: string) => Promise<boolean>;
  uploadPlayerConfig: (config: PlayerConfig) => Promise<boolean>;
}

interface SnackBarState {
  open: boolean;
  text: string;
}

export default function SyncPlayerConfigPanel(props: SyncPlayerConfigPanelProps) {
  const { playerConfig, setPlayerConfig, downloadPlayerConfig, uploadPlayerConfig } = props;
  const [id, setId] = useState<string>(playerConfig.nanoid !== undefined ? playerConfig.nanoid : "");
  const [idError, setIdError] = useState<boolean>(false);
  const [snackBarState, setSnackBarState] = useState<SnackBarState>({
    open: false,
    text: "",
  });
  const { open } = snackBarState;
  const [loading, setLoading] = useState(false);

  const openSnackBar = (text: string) => {
    setSnackBarState({ open: true, text });
  };

  const closeSnackBar = () => {
    setSnackBarState({ open: false, text: "" });
  };

  const validateId = () => {
    return /^[A-Za-z0-9_-]{21}$/.test(id);
  };

  const onIdFieldBlur = () => {
    if (!validateId()) {
      setIdError(true);
    } else {
      setIdError(false);
    }
  };

  const handleDownload = async () => {
    // if id is valid, pass it to downloadPlayerConfig
    if (validateId()) {
      setIdError(false);

      setLoading(true);
      const success = await downloadPlayerConfig(id);
      setLoading(false);

      if (success) {
        openSnackBar("下载成功");
      } else {
        // TODO: show error message
        openSnackBar("下载失败，请检查ID是否正确。");
      }
      sendGTMEvent({
        event: "sync_player_config",
        category: "player_config",
        action: "download",
        label: success ? "success" : "failure",
      });
    } else {
      setIdError(true);
    }
  };

  const handleUpload = async () => {
    if (playerConfig.nanoid === undefined) {
      playerConfig.nanoid = nanoid();
      setPlayerConfig(playerConfig);
      setId(playerConfig.nanoid);
      setIdError(false);
    }

    setLoading(true);
    const success = await uploadPlayerConfig(playerConfig);
    setLoading(false);

    if (success) {
      openSnackBar("上传成功");
    } else {
      openSnackBar("上传失败。");
    }

    sendGTMEvent({
      event: "sync_player_config",
      category: "player_config",
      action: "upload",
      label: success ? "success" : "failure",
    });
  };

  const handleCopy = () => {
    // copy id to clipboard
    navigator.clipboard.writeText(id);
  };

  const handleClear = () => {
    setPlayerConfig(INITIAL_PLAYER_CONFIG);
  };

  useEffect(() => {
    if (playerConfig.nanoid !== undefined) {
      setId(playerConfig.nanoid);
    }
  }, [playerConfig.nanoid]);

  return (
    <Box className="flex justify-start flex-wrap items-center">
      <TextField
        className="w-56"
        label="ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
        onBlur={onIdFieldBlur}
        error={idError && !!id}
        // disabled={playerConfig.nanoid !== undefined}
      />
      <Button className="m-4" disabled={(!!id && idError) || loading} onClick={handleUpload}>
        업로드
      </Button>
      <Button className="m-4" disabled={idError || loading} onClick={handleDownload}>
        다운로드
      </Button>
      <Button className="m-4" disabled={idError || loading} onClick={handleCopy}>
        아이디 복사
      </Button>

      {loading && <CircularProgress />}

      <Box className="grow"></Box>

      <Button className="m-4" onClick={handleClear} color="error">
        로컬 설정 초기화
      </Button>

      <Typography className="basis-full p-2">
       처음 업로드하는 경우 ID를 비워두고 직접 업로드 버튼을 클릭하면 시스템에서 자동으로 ID가 생성됩니다. 그런 다음 동기화가 필요한 장치에 ID를 입력하고 다운로드를 클릭하세요.
      </Typography>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={open}
        onClose={closeSnackBar}
        message={snackBarState.text}
        key="sync-player-config-snackbar"
      />
    </Box>
  );
}
