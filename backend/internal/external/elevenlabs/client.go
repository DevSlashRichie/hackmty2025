package elevenlabs

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

const (
	BaseUrl = "https://api.elevenlabs.io/v1"
)

type Client struct {
	apiKey     string
	httpClient *http.Client
}

func NewClient(apiKey string) *Client {
	return &Client{
		apiKey:     apiKey,
		httpClient: &http.Client{},
	}
}

type TTSRequestInput struct {
	Text    string `json:"text"`
	VoiceId string `json:"voice_id"`
}

type TTSRequest struct {
	Inputs       []TTSRequestInput `json:"inputs"`
	LanguageCode string            `json:"language_code"`
}

func (c *Client) Generate(input string) ([]byte, error) {
	url := BaseUrl + "/text-to-dialogue"

	payload, err := json.Marshal(TTSRequest{
		Inputs: []TTSRequestInput{{
			Text:    input,
			VoiceId: "CaJslL1xziwefCeTNzHv",
		}},
		LanguageCode: "es",
	})
	if err != nil {
		return nil, err
	}

	bufPayload := bytes.NewBuffer(payload)

	req, err := http.NewRequest("POST", url, bufPayload)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("xi-api-key", c.apiKey)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}
