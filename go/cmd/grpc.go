/*
Copyright © 2023 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"os"

	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/application/grpc"
	"github.com/Fabricio1805/imersaoFullCycle/codePix-go/infrastructure/db"
	"github.com/spf13/cobra"
)

var (portNumber int)

var grpcCmd = &cobra.Command{
	Use:   "grpc",
	Short: "start a gRPC server",
	
	Run: func(cmd *cobra.Command, args []string) {
		database := db.ConnectDB(os.Getenv("env"))
		go grpc.StartGrpcServer(database, portNumber)
	},
}

func init() {
	rootCmd.AddCommand(grpcCmd)
	grpcCmd.Flags().IntVarP(&portNumber, "port", "p", 50051, "gRPC Server port")
}
