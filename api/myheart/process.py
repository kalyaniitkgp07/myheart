BPM_THRESHOLD = 100


def classify_heart_rate(bpm: int) -> str:
    """
    Algorithm: If heart_rate is high (> 100), flag as HIGH, otherwise NORMAL.
    """
    if bpm > BPM_THRESHOLD:
        return "HIGH"
    return "NORMAL"